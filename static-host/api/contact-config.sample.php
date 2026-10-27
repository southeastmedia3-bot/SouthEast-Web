<?php
/**
 * Delivery settings for api/contact.php.
 *
 * SETUP: copy this file to `contact-config.php` in the same folder ON THE SERVER
 * and fill it in. The real file holds secrets (the Resend key, the webhook URL):
 * never commit it, never put it anywhere web-readable. The generated .htaccess
 * blocks direct web access to contact-config.php, and the guard below is a second
 * line of defence in case that rule is ever lost.
 *
 * All values are strings (or null). Everything is optional, but with nothing
 * usable configured every enquiry is refused with a 502 and the visitor is sent
 * to the studio email, by design: a form that silently drops leads is worse than
 * one that says it failed.
 */

// If this file is requested directly (rather than include()d by contact.php), stop.
if (realpath(__FILE__) === realpath($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    http_response_code(403);
    exit;
}

return [
    /**
     * Where enquiries are sent. One or more plain addresses, comma-separated
     * ("a@x.in, b@x.in"); no "Name <addr>" forms.
     */
    'to' => 'info@southeastmedia.in',

    /**
     * The From address (also the envelope sender for mail()). It MUST be on the
     * site's own domain so SPF / DKIM / DMARC line up; it does not have to be a
     * real mailbox, but replies to bounces go there, so a real one is kinder.
     * A bare address, or "Southeast Media <enquiries@southeastmedia.in>".
     * With Resend it must be on a domain you have verified in Resend.
     */
    'from' => 'enquiries@southeastmedia.in',

    /**
     * Optional. Sends through Resend (https://resend.com) over cURL; far more
     * reliable than mail(). Needs `to` too. Leave '' to skip. Looks like "re_...".
     */
    'resend_api_key' => '',

    /**
     * Optional. Also POSTs the enquiry as JSON to this URL, e.g. a Slack or Teams
     * incoming webhook. Leave '' to skip. Must be http(s).
     */
    'webhook_url' => '',

    /**
     * Rate-limit client identification. null (the default) uses the connecting
     * address, which cannot be forged. If, and only if, the site sits behind a
     * proxy that every request passes through, set the header it supplies:
     *   'CF-Connecting-IP'   Cloudflare
     *   'X-Forwarded-For'    another single trusted proxy (the LAST entry is used)
     * Any other value is ignored. Never set this on a directly exposed site: the
     * caller controls the header and could dodge the limiter.
     */
    'trust_proxy_header' => null,

    /**
     * Optional. Absolute path of a directory for the rate-limit counters, which
     * should NOT be under the web root. null uses a private folder inside the
     * system temp directory (fine on most hosts).
     */
    'rate_limit_dir' => null,

    /**
     * Optional. Reported as "source" in the webhook payload. Defaults to
     * https://www.southeastmedia.in.
     */
    // 'site_url' => 'https://www.southeastmedia.in',
];
