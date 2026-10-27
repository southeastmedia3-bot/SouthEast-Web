# Contact form on the static host

The static site has no Node server, so the enquiry form POSTs to `api/contact.php`
(a PHP port of `app/api/contact/route.ts`). It needs PHP 7.4+ and, for Resend or a
webhook, the cURL extension. No Composer, nothing to install.

## Set up (once, on the server)

1. Upload the site as usual; `api/contact.php` and `api/contact-config.sample.php`
   come with it.
2. In `api/`, copy `contact-config.sample.php` to **`contact-config.php`** and fill it in:
   - `to`: where enquiries go (`info@southeastmedia.in`).
   - `from`: an address **on southeastmedia.in** (`enquiries@southeastmedia.in`).
   - `resend_api_key`: optional, strongly recommended (see below).
   - `webhook_url`: optional (Slack / Teams).
3. Permissions: `contact-config.php` **0600** (0640 if PHP runs as another user and
   cannot read it), `contact.php` 0644, folders 0755. The file is secret: do not
   commit it, do not email it.
4. `contact-config.php` is blocked from web access by the generated `.htaccess`.
   If that rule is ever lost, the file also refuses to run when requested directly
   (403) and only ever `return`s an array, so it cannot print its contents.

With nothing usable in the config, every enquiry gets a 502 and the visitor is told
to email the studio. That is deliberate; the reason is written to the PHP error log.

## Test it

Each request counts toward the limit (5 per 10 minutes per visitor). A request
with a valid brief sends a real email, so use your own address in `to` first.

```sh
URL=https://www.southeastmedia.in/api/contact.php

curl -i $URL                                                    # 405, Allow: POST
curl -i -X POST -H 'Content-Type: text/plain' -d x $URL         # 415
curl -i -X POST -H 'Content-Type: application/json' -d '{}' $URL   # 422 with issues

curl -i -X POST -H 'Content-Type: application/json' -d '{"name":"Test Person","email":"you@example.com","organization":"Test Org","projectType":"Animation","message":"This is a delivery test of the enquiry form."}' $URL
# 200 {"ok":true} and an email arrives. 502 means nothing was delivered: read error_log.

curl -i https://www.southeastmedia.in/api/contact-config.php    # must be 403/404, never 200
```

Where is the log? PHP writes to the `error_log` file in the folder of the failing
script (`api/error_log`) or to cPanel's Errors page. Check that file is not
web-readable (`curl -i .../api/error_log` should not be 200). It never contains the
enquiry text, only the reason a delivery failed.

## Making sure the email arrives

- **PHP `mail()`** (used when only `to` is set) returns success when the server's
  mail system *accepts* the message, not when Gmail or Outlook does. Deliverability
  rests on DNS for `southeastmedia.in`; the domain's mail is hosted at webhostbox, so
  in its cPanel open **Email Deliverability** and make sure SPF and DKIM both show
  valid (use *Repair* if not). Add a DMARC record too:
  `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:info@southeastmedia.in`. `from` must be
  on that domain or SPF/DKIM will not line up and Gmail will spam-fold or drop it.
  Verify with a test and Gmail's *Show original*: SPF and DKIM should say PASS.
- **Resend** (set `resend_api_key`) is the reliable path: it sends from authenticated
  infrastructure instead of the shared web server, gets proper bounce/complaint
  handling, and returns an error we can log instead of silently dropping. Add the
  domain in Resend, put the DNS records it shows wherever the domain's DNS is managed
  (check they do not replace the existing SPF record that webhostbox mail relies on),
  and keep `from` on that domain. Resend is used instead of `mail()`, not as well as it.
- Behind Cloudflare later? Set `trust_proxy_header` to `CF-Connecting-IP` so the rate
  limiter sees visitors rather than Cloudflare. Leave it `null` otherwise.
