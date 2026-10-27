<?php
/**
 * Contact enquiry endpoint for the static (cPanel / Apache + PHP) build.
 *
 * This is the PHP twin of app/api/contact/route.ts, lib/contact-delivery.ts and
 * lib/rate-limit.ts. The browser POSTs the enquiry form here as JSON. Same
 * contract, same status codes, same response bodies:
 *
 *   405  not a POST                      {"ok":false,"error":"Method not allowed"}  (+ Allow: POST)
 *   429  rate limited                    {"ok":false,"error":"Too many enquiries. ..."} (+ Retry-After)
 *   415  not application/json            {"ok":false,"error":"Expected application/json"}
 *   413  body over 16 KiB                {"ok":false,"error":"Payload too large"}
 *   400  body is not JSON                {"ok":false,"error":"Invalid JSON"}
 *   422  fails the schema                {"ok":false,"error":"Validation failed","issues":{...}}
 *   200  honeypot hit OR delivered       {"ok":true}
 *   502  nothing delivered / configured  {"ok":false,"error":"Delivery failed"}
 *
 * Delivery is configured by contact-config.php next to this file (copy it from
 * contact-config.sample.php; it is secret and is never committed). See README.md
 * in the static-host folder.
 *
 * Plain PHP 7.4+, no Composer, no libraries. Needs the json extension; uses
 * mbstring and cURL when present (cURL is required for the Resend / webhook
 * transports, mbstring only improves non-ASCII subject encoding).
 *
 * Deliberate differences from the Node route, none of which a legitimate
 * client can notice:
 *   - Length rules count Unicode code points (mb_strlen); JS counts UTF-16 code
 *     units, so an emoji is 1 here and 2 there. Irrelevant at 2 / 20 characters.
 *   - The Content-Type check compares the media type exactly rather than doing
 *     a substring match (see the CSRF note in sem_main()).
 *   - The enquirer's address must also be free of characters that could split a
 *     header address list, which filter_var() alone does not guarantee.
 *   - Subject text is capped at 120 characters of organization name.
 */

// Nothing may reach the visitor except the JSON we choose to send: no notices,
// no warnings, no stack traces. Errors are still logged by PHP / error_log().
@ini_set('display_errors', '0');
@ini_set('html_errors', '0');
// Buffer everything so a stray byte (a notice, a BOM in an included file) can
// neither corrupt the JSON nor trigger "headers already sent".
ob_start();
if (function_exists('mb_internal_encoding')) {
    @mb_internal_encoding('UTF-8');
}

/** Refuse oversized bodies before (and after) parsing them. */
const SEM_MAX_BODY_BYTES = 16384; // 16 KiB

/** Five submissions per client per ten minutes. A human sends one. */
const SEM_RATE_LIMIT = 5;
/** Backstop across every caller, on top of the per-client limit. */
const SEM_GLOBAL_LIMIT = 120;
const SEM_RATE_WINDOW = 600; // seconds
const SEM_GLOBAL_KEY = '__global__';

const SEM_DEFAULT_SITE_URL = 'https://www.southeastmedia.in';
const SEM_DEFAULT_FROM_NAME = 'Southeast Media';

/** Keep in step with projectTypes in data/contact.ts. */
const SEM_PROJECT_TYPES = [
    'Medical & Pharma',
    'Institutional Real Estate',
    'Film & VFX',
    'Animation',
    'Startup / Incubator',
    'Product & E-Commerce',
    'SaaS & Product',
    'Enterprise / Retainer',
    'Something else',
];

/* -------------------------------------------------------------------------- */
/* Responses                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Send a JSON response and stop.
 *
 * An enquiry response must never be stored by a CDN, a corporate proxy or the
 * browser, or a shared cache can serve one visitor's confirmation (or error) to
 * the next. Hence no-store on every response, errors included.
 */
function sem_respond($status, $body, $headers = array())
{
    $GLOBALS['sem_responded'] = true;
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        header('X-Content-Type-Options: nosniff');
        foreach ($headers as $name => $value) {
            header($name . ': ' . $value);
        }
    }
    $json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo ($json !== false) ? $json : '{"ok":false,"error":"Server error"}';
    exit;
}

// Last-resort nets: never leak a stack trace, never answer with an HTML 500.
set_exception_handler(function ($e) {
    error_log('[contact] uncaught ' . get_class($e) . ': ' . $e->getMessage()
        . ' in ' . $e->getFile() . ':' . $e->getLine());
    sem_respond(500, array('ok' => false, 'error' => 'Server error'));
});
register_shutdown_function(function () {
    if (!empty($GLOBALS['sem_responded'])) {
        return;
    }
    $e = error_get_last();
    $fatal = array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR, E_RECOVERABLE_ERROR);
    if ($e !== null && in_array($e['type'], $fatal, true)) {
        error_log('[contact] fatal: ' . $e['message'] . ' in ' . $e['file'] . ':' . $e['line']);
        sem_respond(500, array('ok' => false, 'error' => 'Server error'));
    }
});

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Load contact-config.php. Returns array($config, $problem) where $problem is a
 * log-only string when the file is missing or unusable. A missing file means
 * "nothing configured": the enquiry is refused with a 502 and the reason goes to
 * error_log, never to the visitor.
 */
function sem_load_config()
{
    $path = __DIR__ . '/contact-config.php';
    if (!is_file($path)) {
        return array(array(), 'contact-config.php not found next to contact.php');
    }
    try {
        $config = include $path;
    } catch (\Throwable $e) {
        return array(array(), 'contact-config.php could not be loaded: ' . $e->getMessage());
    }
    if (!is_array($config)) {
        return array(array(), 'contact-config.php must `return` an array');
    }
    return array($config, null);
}

/** A trimmed string config value, or '' when absent / not a string. */
function sem_cfg($config, $key)
{
    return (isset($config[$key]) && is_string($config[$key])) ? trim($config[$key]) : '';
}

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Best-effort client address, used only to pick a rate-limit bucket.
 *
 * REMOTE_ADDR is the TCP peer and cannot be forged, so it is the default. A
 * forwarding header is honoured ONLY when contact-config.php opts in with
 * `trust_proxy_header` (e.g. once Cloudflare is in front), because otherwise the
 * caller controls it and could mint a fresh bucket per request by varying one
 * header, defeating the limiter. When opted in:
 *   - CF-Connecting-IP is a single value set by Cloudflare;
 *   - X-Forwarded-For is read from the RIGHT: the last entry is the one our
 *     trusted proxy appended; everything to its left is whatever the client sent.
 * Only turn that on if the origin is reachable through the proxy alone.
 */
function sem_client_ip($config)
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? trim((string) $_SERVER['REMOTE_ADDR']) : '';

    $header = strtolower(sem_cfg($config, 'trust_proxy_header'));
    if ($header === 'cf-connecting-ip' || $header === 'x-forwarded-for') {
        $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $header));
        $value = isset($_SERVER[$serverKey]) ? trim((string) $_SERVER[$serverKey]) : '';
        if ($value !== '' && $header === 'x-forwarded-for') {
            $hops = explode(',', $value);
            $value = trim((string) end($hops));
        }
        if ($value !== '' && filter_var($value, FILTER_VALIDATE_IP) !== false) {
            $ip = $value;
        }
    }

    if (filter_var($ip, FILTER_VALIDATE_IP) === false) {
        return 'unknown';
    }

    // One IPv6 customer owns a whole /64, so bucket by the prefix; unwrap
    // IPv4-mapped addresses (::ffff:a.b.c.d) so they share a bucket with plain IPv4.
    $bin = @inet_pton($ip);
    if ($bin !== false && strlen($bin) === 16) {
        if (substr($bin, 0, 12) === "\0\0\0\0\0\0\0\0\0\0\xff\xff") {
            return (string) inet_ntop(substr($bin, 12));
        }
        return bin2hex(substr($bin, 0, 8)) . '/64';
    }
    return $ip;
}

/** Where the counters live. Not under the web root by default. */
function sem_rate_dir($config)
{
    $custom = sem_cfg($config, 'rate_limit_dir');
    if ($custom !== '') {
        return rtrim($custom, '/\\');
    }
    return rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'sem-contact-' . substr(sha1(__DIR__), 0, 10);
}

/** Create the counter directory (0700) with a deny-all .htaccess in case it is web-served. */
function sem_prepare_dir($dir)
{
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
        if (!is_dir($dir)) {
            return false;
        }
        @file_put_contents(
            $dir . DIRECTORY_SEPARATOR . '.htaccess',
            "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n"
            . "<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n"
        );
    }
    return is_writable($dir);
}

/**
 * Fixed-window counters, in one JSON file guarded by flock() so concurrent
 * requests cannot lose updates. Mirrors lib/rate-limit.ts: a bucket starts at 1
 * when absent or expired, every call counts (a refused request still counts),
 * and a bucket over its limit reports the seconds until it resets.
 *
 * $buckets is array(key => limit). Expired buckets are pruned on every write;
 * because refused requests still count, the file can never hold more than about
 * GLOBAL_LIMIT + 1 live buckets per window.
 *
 * If the counters cannot be read or written (unwritable temp dir, open_basedir)
 * this FAILS OPEN and logs: a contact form that is down is worse than one that is
 * briefly un-throttled, and validation plus the honeypot still apply.
 */
function sem_rate_limit($dir, $buckets, $window)
{
    $result = array('ok' => true, 'retryAfter' => 0);

    if (!sem_prepare_dir($dir)) {
        error_log('[contact] rate limit disabled: cannot use directory ' . $dir);
        return $result;
    }
    $file = $dir . DIRECTORY_SEPARATOR . 'buckets.json';
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        error_log('[contact] rate limit disabled: cannot open ' . $file);
        return $result;
    }
    @chmod($file, 0600);
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        error_log('[contact] rate limit disabled: cannot lock ' . $file);
        return $result;
    }

    $state = json_decode((string) stream_get_contents($fh), true);
    if (!is_array($state)) {
        $state = array();
    }
    $now = time();

    foreach ($state as $key => $bucket) {
        if (!is_array($bucket) || !isset($bucket['count'], $bucket['resetAt']) || $bucket['resetAt'] <= $now) {
            unset($state[$key]);
        }
    }

    foreach ($buckets as $key => $limit) {
        if (!isset($state[$key])) {
            $state[$key] = array('count' => 1, 'resetAt' => $now + $window);
            continue;
        }
        $state[$key]['count'] = (int) $state[$key]['count'] + 1;
        if ($state[$key]['count'] > $limit) {
            $result['ok'] = false;
            $result['retryAfter'] = max($result['retryAfter'], (int) $state[$key]['resetAt'] - $now);
        }
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, (string) json_encode($state));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    if (!$result['ok'] && $result['retryAfter'] < 1) {
        $result['retryAfter'] = 1;
    }
    return $result;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

/** Length in characters. See the file header for the UTF-16 vs code point note. */
function sem_char_len($s)
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($s, 'UTF-8');
    }
    return (int) preg_match_all('/./su', $s, $m);
}

/** Cut to at most $max characters, marking the cut. */
function sem_truncate($s, $max)
{
    if (sem_char_len($s) <= $max) {
        return $s;
    }
    return (preg_match('/^.{0,' . (int) $max . '}/su', $s, $m) ? $m[0] : substr($s, 0, $max)) . '…';
}

/**
 * A plain address that is safe to put in a header or an envelope: valid per
 * filter_var AND free of the characters (quotes, commas, angle brackets, ...)
 * that filter_var tolerates inside a quoted local part but that would let an
 * address smuggle in a second recipient or header field.
 */
function sem_safe_address($address)
{
    return is_string($address)
        && strlen($address) <= 254
        && filter_var($address, FILTER_VALIDATE_EMAIL) !== false
        && !preg_match('/[\s"(),:;<>\\\\\[\]\x00-\x1F\x7F]/', $address);
}

/**
 * Re-validate the payload exactly like contactSchema in data/contact.ts:
 *   name >= 2, email valid, organization >= 2, projectType in the enum,
 *   budget optional string, message >= 20, company optional string (honeypot).
 * Values are NOT trimmed (zod does not), and every field must be a string
 * (arrays, objects, numbers and null are rejected, as zod rejects them).
 *
 * Returns array($clean, $issues); exactly one is null. $issues has zod's
 * flatten() shape: {formErrors: [], fieldErrors: {field: [messages]}}.
 */
function sem_validate($data)
{
    if (!($data instanceof \stdClass)) {
        return array(null, array('formErrors' => array('Invalid input: expected object'), 'fieldErrors' => (object) array()));
    }
    $in = get_object_vars($data);
    $errors = array();
    $clean = array();

    $text = function ($key, $min, $minMessage, $required) use ($in, &$errors, &$clean) {
        if (!array_key_exists($key, $in)) {
            if ($required) {
                $errors[$key][] = 'Required';
            }
            return;
        }
        if (!is_string($in[$key])) {
            $errors[$key][] = 'Invalid input: expected string';
            return;
        }
        if ($min > 0 && sem_char_len($in[$key]) < $min) {
            $errors[$key][] = $minMessage;
            return;
        }
        $clean[$key] = $in[$key];
    };

    $text('name', 2, 'Please enter your name.', true);
    $text('organization', 2, 'Please enter your organization.', true);
    $text('message', 20, 'A little more detail helps us route you (20+ characters).', true);
    $text('budget', 0, '', false);
    $text('company', 0, '', false);

    if (!array_key_exists('email', $in)) {
        $errors['email'][] = 'Required';
    } elseif (!is_string($in['email'])) {
        $errors['email'][] = 'Invalid input: expected string';
    } elseif (!sem_safe_address($in['email'])) {
        $errors['email'][] = 'Please enter a valid email address.';
    } else {
        $clean['email'] = $in['email'];
    }

    if (!array_key_exists('projectType', $in)) {
        $errors['projectType'][] = 'Required';
    } elseif (!is_string($in['projectType']) || !in_array($in['projectType'], SEM_PROJECT_TYPES, true)) {
        $errors['projectType'][] = 'Invalid option';
    } else {
        $clean['projectType'] = $in['projectType'];
    }

    if ($errors) {
        return array(null, array('formErrors' => array(), 'fieldErrors' => $errors));
    }
    return array($clean, null);
}

/* -------------------------------------------------------------------------- */
/* Delivery                                                                    */
/* -------------------------------------------------------------------------- */

/** Same layout as asPlainText() in lib/contact-delivery.ts. */
function sem_plain_text($v)
{
    $budget = (isset($v['budget']) && $v['budget'] !== '') ? $v['budget'] : '—';
    return implode("\n", array(
        'Name:         ' . $v['name'],
        'Email:        ' . $v['email'],
        'Organization: ' . $v['organization'],
        'Project type: ' . $v['projectType'],
        'Budget:       ' . $budget,
        '',
        $v['message'],
    ));
}

/**
 * Collapse every control character (CR, LF, TAB, NUL, ...) to a space. Applied
 * to EVERY user-supplied value that ends up in a header or subject: a newline
 * in a header value is how an attacker adds a Bcc: or a second message.
 */
function sem_header_value($s)
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/', ' ', (string) $s));
}

/** Header text safe for any header: sanitized, and MIME-encoded when not plain ASCII. */
function sem_encode_header_text($s, $indent = 0)
{
    $s = sem_header_value($s);
    if ($s === '' || preg_match('/^[\x20-\x7E]*$/', $s)) {
        return $s;
    }
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($s, 'UTF-8', 'B', "\r\n", (int) $indent);
    }
    // No mbstring: RFC 2047 base64 words, split on character boundaries.
    $words = array();
    $current = '';
    $chars = preg_split('//u', $s, -1, PREG_SPLIT_NO_EMPTY);
    if ($chars === false) {
        $chars = array();
    }
    foreach ($chars as $char) {
        if (strlen($current . $char) > 42) {
            $words[] = '=?UTF-8?B?' . base64_encode($current) . '?=';
            $current = '';
        }
        $current .= $char;
    }
    if ($current !== '') {
        $words[] = '=?UTF-8?B?' . base64_encode($current) . '?=';
    }
    return implode("\r\n ", $words);
}

/** A display name for From:, quoted when ASCII, encoded-word when not. */
function sem_display_name($name)
{
    $name = sem_header_value(str_replace(array('"', '\\', '<', '>', '@', ',', ';', ':', '(', ')', '[', ']'), '', (string) $name));
    if ($name === '') {
        $name = SEM_DEFAULT_FROM_NAME;
    }
    $encoded = sem_encode_header_text($name, 6);
    return preg_match('/^[\x20-\x7E]*$/', $encoded) ? '"' . $encoded . '"' : $encoded;
}

/** Split `Name <addr>` or a bare address into array($name, $address); null when unusable. */
function sem_parse_from($from)
{
    $from = sem_header_value($from);
    $name = SEM_DEFAULT_FROM_NAME;
    if (preg_match('/^(.*)<([^<>]+)>$/', $from, $m)) {
        $given = trim($m[1], " \t\"");
        if ($given !== '') {
            $name = $given;
        }
        $address = trim($m[2]);
    } else {
        $address = $from;
    }
    return sem_safe_address($address) ? array($name, $address) : null;
}

/** The configured recipients: comma-separated plain addresses, invalid ones dropped and logged. */
function sem_recipients($to)
{
    $valid = array();
    foreach (explode(',', $to) as $candidate) {
        $candidate = trim($candidate);
        if ($candidate === '') {
            continue;
        }
        if (sem_safe_address($candidate)) {
            $valid[] = $candidate;
        } else {
            error_log('[contact] ignoring invalid recipient in config "to": ' . sem_header_value($candidate));
        }
    }
    return $valid;
}

function sem_subject($v)
{
    return 'New enquiry — ' . sem_truncate(sem_header_value($v['organization']), 120) . ' (' . $v['projectType'] . ')';
}

/**
 * POST JSON with cURL. Returns true on any 2xx; logs and returns false
 * otherwise. http(s) only, no redirects, TLS verification left ON.
 */
function sem_post_json($label, $url, $headers, $payload)
{
    if (!preg_match('#^https?://#i', $url)) {
        error_log('[contact] ' . $label . ' skipped: URL must be http(s)');
        return false;
    }
    if (!function_exists('curl_init')) {
        error_log('[contact] ' . $label . ' skipped: the PHP cURL extension is not available');
        return false;
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 12,
    ));
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    if (PHP_VERSION_ID < 80000) {
        curl_close($ch); // a no-op since 8.0 and deprecated in 8.5; the handle frees itself
    }

    if ($body === false) {
        error_log('[contact] ' . $label . ' delivery failed: ' . $error);
        return false;
    }
    if ($status < 200 || $status > 299) {
        error_log('[contact] ' . $label . ' delivery failed: responded ' . $status . ' ' . substr((string) $body, 0, 200));
        return false;
    }
    return true;
}

/** Resend, same payload shape as sendViaResend() in lib/contact-delivery.ts. */
function sem_send_resend($v, $apiKey, $recipients, $from)
{
    // Node falls back to Resend's shared sender when none is configured.
    $sender = 'Southeast Media <onboarding@resend.dev>';
    if ($from !== '') {
        $parsed = sem_parse_from($from);
        if ($parsed === null) {
            error_log('[contact] resend skipped: config "from" is not a valid address');
            return false;
        }
        $label = trim(str_replace(array('"', '\\', '<', '>', ','), '', $parsed[0]));
        $sender = ($label !== '') ? $label . ' <' . $parsed[1] . '>' : $parsed[1];
    }
    $plain = sem_plain_text($v);
    $payload = json_encode(array(
        'from' => $sender,
        'to' => array_values($recipients),
        // So a one-key reply in any mail client goes back to the enquirer.
        'reply_to' => $v['email'],
        'subject' => sem_subject($v),
        'text' => $plain,
        'html' => '<pre style="font:14px/1.6 ui-monospace,monospace;white-space:pre-wrap">'
            . htmlspecialchars($plain, ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8') . '</pre>',
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($payload === false) {
        error_log('[contact] resend skipped: payload could not be encoded');
        return false;
    }
    return sem_post_json('resend', 'https://api.resend.com/emails', array(
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        // Resend rejects requests without one; Node's fetch sends its own.
        'User-Agent: southeastmedia-contact/1.0',
    ), $payload);
}

/** Webhook, same payload as sendViaWebhook(): `text` for Slack/Teams plus the raw fields. */
function sem_send_webhook($v, $url, $siteUrl)
{
    $body = array_merge(array(
        'text' => '*New enquiry — ' . $v['organization'] . "*\n```" . sem_plain_text($v) . '```',
        'source' => $siteUrl,
        'submittedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    ), $v);
    $payload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($payload === false) {
        error_log('[contact] webhook skipped: payload could not be encoded');
        return false;
    }
    return sem_post_json('webhook', $url, array('Content-Type: application/json'), $payload);
}

/**
 * Fallback transport: PHP mail(). True means the local MTA ACCEPTED the message,
 * not that it was delivered; see README.md for SPF / DKIM.
 */
function sem_send_mail($v, $recipients, $from)
{
    $parsed = sem_parse_from($from);
    if ($parsed === null) {
        error_log('[contact] mail() fallback needs a valid "from" address in contact-config.php (on the site\'s own domain)');
        return false;
    }
    list($name, $address) = $parsed;

    $headers = array(
        'From: ' . sem_display_name($name) . ' <' . $address . '>',
        // The enquirer's address, already validated and stripped of control characters.
        'Reply-To: ' . sem_header_value($v['email']),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: quoted-printable',
    );
    $body = quoted_printable_encode((string) preg_replace('/\r\n|\r|\n/', "\r\n", sem_plain_text($v)));
    $subject = sem_encode_header_text(sem_subject($v), 9);

    // -f sets the envelope sender so the bounce path and SPF line up with the
    // site's domain. PHP escapes it; the strict pattern is belt and braces.
    $extra = preg_match('/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+$/', $address) ? '-f' . $address : '';

    $sent = @mail(implode(',', $recipients), $subject, $body, implode("\r\n", $headers), $extra);
    if (!$sent) {
        error_log('[contact] mail() refused the message (check the server mail setup)');
    }
    return (bool) $sent;
}

/**
 * Attempt every configured transport. True when at least one succeeded; false
 * when nothing is configured or every configured transport failed, so the
 * route answers 502 and the visitor is told to email instead of being shown a
 * confirmation for a brief nobody will read. The reason is logged (without the
 * enquiry itself: this host's error_log may sit next to the script) and is
 * never sent to the visitor.
 */
function sem_deliver($v, $config, $configProblem)
{
    $recipients = sem_recipients(sem_cfg($config, 'to'));
    $apiKey = (string) preg_replace('/\s+/', '', sem_cfg($config, 'resend_api_key'));
    $webhook = sem_cfg($config, 'webhook_url');
    $from = sem_cfg($config, 'from');
    $siteUrl = rtrim(sem_cfg($config, 'site_url') !== '' ? sem_cfg($config, 'site_url') : SEM_DEFAULT_SITE_URL, '/');

    // Resend needs the key AND a recipient (RESEND_API_KEY + CONTACT_TO_EMAIL in Node).
    $useResend = $apiKey !== '' && count($recipients) > 0;
    $useWebhook = $webhook !== '';
    // mail() only when nothing else is configured.
    $useMail = !$useResend && !$useWebhook && count($recipients) > 0;

    if (!$useResend && !$useWebhook && !$useMail) {
        error_log('[contact] No delivery transport configured; enquiry REFUSED. '
            . ($configProblem !== null ? $configProblem . '. ' : '')
            . 'Set resend_api_key + to, or webhook_url, or just to (mail() fallback) in contact-config.php.');
        return false;
    }

    $results = array();
    if ($useResend) {
        $results[] = sem_send_resend($v, $apiKey, $recipients, $from);
    }
    if ($useWebhook) {
        $results[] = sem_send_webhook($v, $webhook, $siteUrl);
    }
    if ($useMail) {
        $results[] = sem_send_mail($v, $recipients, $from);
    }
    return in_array(true, $results, true);
}

/* -------------------------------------------------------------------------- */
/* Request                                                                     */
/* -------------------------------------------------------------------------- */

function sem_main()
{
    // Everything that is not a POST. Name the one supported verb: correct HTTP,
    // and one less thing for a scanner to flag.
    if ((isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '') !== 'POST') {
        sem_respond(405, array('ok' => false, 'error' => 'Method not allowed'), array('Allow' => 'POST'));
    }

    list($config, $configProblem) = sem_load_config();

    // Rate limit first, as the Node route does: bad requests spend quota too.
    $clientBucket = 'c:' . substr(hash('sha256', sem_client_ip($config)), 0, 32);
    $limit = sem_rate_limit(
        sem_rate_dir($config),
        array($clientBucket => SEM_RATE_LIMIT, SEM_GLOBAL_KEY => SEM_GLOBAL_LIMIT),
        SEM_RATE_WINDOW
    );
    if (!$limit['ok']) {
        sem_respond(
            429,
            array('ok' => false, 'error' => 'Too many enquiries. Please try again shortly.'),
            array('Retry-After' => (string) $limit['retryAfter'])
        );
    }

    /**
     * Require a JSON content type.
     *
     * This is the CSRF-relevant check, not a formality. `application/json` is not
     * a CORS-simple content type, so a cross-origin `fetch` carrying it is held
     * behind a preflight that this origin never answers. A plain HTML form, by
     * contrast, can POST cross-origin with no preflight at all, but only as
     * `text/plain`, `multipart/form-data` or `application/x-www-form-urlencoded`.
     * Rejecting those three is what makes the forged-form path a dead end.
     *
     * The media type is compared exactly (parameters such as `; charset=utf-8`
     * are fine). A substring match would also accept `text/plain;
     * x=application/json`, which IS a CORS-simple type and would reopen the hole.
     */
    $contentType = isset($_SERVER['CONTENT_TYPE'])
        ? (string) $_SERVER['CONTENT_TYPE']
        : (isset($_SERVER['HTTP_CONTENT_TYPE']) ? (string) $_SERVER['HTTP_CONTENT_TYPE'] : '');
    $mediaType = strtolower(trim(explode(';', $contentType, 2)[0]));
    if ($mediaType !== 'application/json') {
        sem_respond(415, array('ok' => false, 'error' => 'Expected application/json'));
    }

    $declaredLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($declaredLength > SEM_MAX_BODY_BYTES) {
        sem_respond(413, array('ok' => false, 'error' => 'Payload too large'));
    }

    // A missing or lying Content-Length must not become an unbounded read: it is
    // a header the caller controls, so read at most one byte past the cap.
    $raw = file_get_contents('php://input', false, null, 0, SEM_MAX_BODY_BYTES + 1);
    if ($raw === false) {
        $raw = '';
    }
    if (strlen($raw) > SEM_MAX_BODY_BYTES) {
        sem_respond(413, array('ok' => false, 'error' => 'Payload too large'));
    }

    $payload = json_decode($raw, false, 32);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sem_respond(400, array('ok' => false, 'error' => 'Invalid JSON'));
    }

    list($values, $issues) = sem_validate($payload);
    if ($values === null) {
        sem_respond(422, array('ok' => false, 'error' => 'Validation failed', 'issues' => $issues));
    }

    // Honeypot: silently accept but drop obvious bots. Validation ran first, as
    // in the original. `!== ''` (not truthiness) because PHP treats "0" as empty
    // and JS does not.
    if (isset($values['company']) && $values['company'] !== '') {
        sem_respond(200, array('ok' => true));
    }

    if (!sem_deliver($values, $config, $configProblem)) {
        // The brief reached nobody. Say so rather than confirm an enquiry that
        // will never be read; the client surfaces the studio email as a fallback.
        sem_respond(502, array('ok' => false, 'error' => 'Delivery failed'));
    }

    sem_respond(200, array('ok' => true));
}

sem_main();
