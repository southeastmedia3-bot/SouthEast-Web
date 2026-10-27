#!/usr/bin/env node
/**
 * Build the site as a static export for plain cPanel / Apache hosting.
 *
 *   npm run build:static        ->  out/   (upload the CONTENTS of out/ to public_html)
 *
 * This is a second, parallel build mode. The normal `npm run build` (Firebase App
 * Hosting) is untouched: every change below is gated on STATIC_EXPORT=1 or lives
 * in this script.
 *
 * WHAT IT DOES
 *   1. Moves the two things that cannot take part in a static export out of the way:
 *        - app/api            A POST route handler is incompatible with
 *                             `output: "export"`; the PHP handler in static-host/
 *                             replaces it. The FILES in it are moved, not the folder:
 *                             Windows refuses to rename a folder an editor is watching.
 *        - .next              `output: "export"` always writes its intermediate
 *                             artifacts to `.next` (a custom distDir only renames
 *                             the OUTPUT folder), so a static build would otherwise
 *                             replace a Firebase-style build. The previous build is
 *                             parked and put back, so `next start` after this still
 *                             works. Only the entries `next build` itself would wipe
 *                             are moved — NOT `.next/dev` or `.next/cache`, which it
 *                             leaves alone. That matters on Windows: an editor or
 *                             `next dev` keeps handles open inside `.next/dev`, and a
 *                             directory with an open handle cannot be renamed (EPERM).
 *                             If some other entry cannot be parked either, the script
 *                             says so and builds anyway: the old `.next` is then
 *                             replaced, and `npm run build` regenerates it.
 *        - .next/dev/types    If `next dev` ever ran, this holds a validator.ts that
 *                             imports app/api/contact/route.js. tsconfig includes it,
 *                             so with the route gone the build's type-check fails on
 *                             it. (Its files are moved, for the same watcher reason.)
 *      All of it goes to .static-build-stash/ and ALWAYS comes back — on success, on a
 *      failed build, on Ctrl+C / SIGTERM, and as a last resort from the process
 *      `exit` hook. If a run was killed so hard even that did not run (power cut,
 *      Task Manager), the next run finds the stash, restores it and stops so you can
 *      check git status before building again.
 *   2. Runs `next build` with STATIC_EXPORT=1 (see next.config.ts) and
 *      NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact.php. The NEXT_PUBLIC_* values that
 *      apphosting.yaml sets for Firebase (site URL, GA, Clarity) are read from it so
 *      both builds bake in the same values; anything already in the environment wins.
 *   3. Copies static-host/ (the PHP contact handler) into out/.
 *   4. Generates out/.htaccess — security headers (from config/security-headers.mjs,
 *      the same module next.config.ts uses), cache rules, MIME types, compression,
 *      https + www redirects, 404 page.
 *   5. Sanity-checks the result and prints a summary.
 */
import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  rmdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

const outDir = path.join(root, "out");
const hostDir = path.join(root, "static-host");
const apiLive = path.join(root, "app", "api");
const nextLive = path.join(root, ".next");
const stashDir = path.join(root, ".static-build-stash");
const apiStash = path.join(stashDir, "api");
const nextStash = path.join(stashDir, "next");
/** `next dev`'s generated types, which tsconfig includes. See stashAway(). */
const devTypesLive = path.join(nextLive, "dev", "types");
const devTypesStash = path.join(stashDir, "dev-types");
/** Present when there was no `.next` before the build, so the static one is deleted afterwards. */
const noNextMarker = path.join(stashDir, "had-no-next");

const CONTACT_ENDPOINT = "/api/contact.php";

const rel = (p) => path.relative(root, p) || ".";
const log = (msg = "") => console.log(msg);
const step = (msg) => console.log(`\n[build:static] ${msg}`);

// ─── Small filesystem helpers (sync, so the `exit` hook can use them) ───────────

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Directory renames fail on Windows with EPERM/EBUSY/EACCES while an editor,
 * file watcher or antivirus still holds a handle inside. Those clear in a moment,
 * so retry rather than abort.
 */
function renameWithRetry(from, to) {
  for (let attempt = 1; ; attempt++) {
    try {
      renameSync(from, to);
      return;
    } catch (error) {
      const transient = ["EPERM", "EBUSY", "EACCES"].includes(error.code);
      if (!transient || attempt >= 10) throw error;
      sleepSync(300);
    }
  }
}

const removeTree = (target) =>
  rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });

// ─── Stash: move app/api and .next aside, always put them back ──────────────────

/**
 * What `next build` leaves alone when it cleans `.next` (`cleanDistDir`, in
 * next/dist/build/index.js). Mirrored here so the stash moves exactly the entries
 * the static build would destroy, and nothing it would not.
 */
const NEXT_KEEPS = /^(cache|dev|lock)/;

/** "stashing" while things are being moved; "building" once `next build` may have written into .next. */
const stateFile = path.join(stashDir, "state");

let stashed = false;

const nextEntries = (dir) => readdirSync(dir).filter((name) => !NEXT_KEEPS.test(name));

/** Delete what a static build put in .next, leaving cache/ and dev/ alone. */
function purgeNextArtifacts() {
  if (!existsSync(nextLive)) return;
  for (const name of nextEntries(nextLive)) removeTree(path.join(nextLive, name));
}

/** Every file under `dir`, as a path relative to it. */
const filesUnder = (dir) =>
  (existsSync(dir) ? listFiles(dir, () => true) : []).map((f) => path.relative(dir, f));

/**
 * Move every FILE under `from` into the same relative place under `to`.
 *
 * Files, not the directory, on purpose. On Windows `app/` and `app/api` can be
 * un-renameable (EPERM) while an editor, TypeScript server or file watcher has a
 * handle open on them, and that is the normal state of a developer's machine.
 * Renaming a file inside a watched directory is always allowed, and an empty
 * `app/api/contact/` left behind is invisible to Next (no route file, no route).
 */
function moveFiles(from, to) {
  for (const file of filesUnder(from)) {
    const target = path.join(to, file);
    if (existsSync(target)) {
      throw new Error(
        `${rel(target)} already exists (also in ${rel(path.join(from, file))}). Refusing to ` +
          `overwrite either: compare them, delete the wrong one by hand, then re-run.`,
      );
    }
    mkdirSync(path.dirname(target), { recursive: true });
    renameWithRetry(path.join(from, file), target);
  }
}

/** Move every parked .next entry back, then drop the (now empty) parking folder. */
function returnParkedNextEntries() {
  for (const name of readdirSync(nextStash)) {
    const target = path.join(nextLive, name);
    if (existsSync(target)) {
      throw new Error(
        `${rel(target)} exists as well as ${rel(path.join(nextStash, name))}. Refusing to ` +
          `overwrite either: compare them, delete the wrong one by hand, then re-run.`,
      );
    }
    renameWithRetry(path.join(nextStash, name), target);
  }
  rmdirSync(nextStash);
}

function stashAway() {
  mkdirSync(stashDir);
  stashed = true; // from here on, restoreSync() must run no matter what
  writeFileSync(stateFile, "stashing");

  // Essential: the export fails without this. A failure aborts the run, and the
  // caller's `finally` puts everything back.
  try {
    moveFiles(apiLive, apiStash);
  } catch (error) {
    throw new Error(
      `could not move ${rel(apiLive)} out of the way (${error.code ?? error.message}). ` +
        `Something has it open: close editor previews or a running dev server and re-run.`,
    );
  }

  // Also essential: a past `next dev` leaves .next/dev/types/validator.ts, which
  // tsconfig includes and which imports app/api/contact/route.js. With the route
  // gone, the build's type-check fails on that stale file. `next dev` regenerates
  // it, and it is put back below either way.
  try {
    moveFiles(devTypesLive, devTypesStash);
  } catch (error) {
    throw new Error(
      `could not move ${rel(devTypesLive)} out of the way (${error.code ?? error.message}). ` +
        `Stop any running 'next dev' and re-run.`,
    );
  }

  // Best effort: this only protects the previous build.
  if (!existsSync(nextLive)) {
    writeFileSync(noNextMarker, "");
  } else {
    mkdirSync(nextStash);
    try {
      for (const name of nextEntries(nextLive)) {
        renameWithRetry(path.join(nextLive, name), path.join(nextStash, name));
      }
    } catch (error) {
      console.warn(
        `[build:static] could not park the existing .next (${error.code ?? error.message}). ` +
          `Building anyway: it will be replaced by the static build's, and ` +
          `'npm run build' regenerates it. To keep it, close whatever has .next open ` +
          `(a dev server, an editor preview) and re-run.`,
      );
      returnParkedNextEntries();
    }
  }
  writeFileSync(stateFile, "building");
}

/**
 * Idempotent. Safe to call when nothing is stashed, or when only half of the
 * stash was ever made.
 */
function restoreSync() {
  if (!existsSync(stashDir)) {
    stashed = false;
    return [];
  }
  const restored = [];
  // Entries in .next that are not parked are ours to delete only once a build has
  // started. Before that they are the original, simply not moved yet.
  const buildMayHaveRun = existsSync(stateFile) && readFileSync(stateFile, "utf8") === "building";

  if (existsSync(apiStash)) {
    moveFiles(apiStash, apiLive);
    removeTree(apiStash); // only the now-empty folders are left
    restored.push(rel(apiLive));
  }

  if (existsSync(devTypesStash)) {
    moveFiles(devTypesStash, devTypesLive);
    removeTree(devTypesStash);
    restored.push(rel(devTypesLive));
  }

  if (existsSync(nextStash)) {
    if (buildMayHaveRun) purgeNextArtifacts(); // the static build's output
    returnParkedNextEntries();
    restored.push(`${rel(nextLive)} (previous build)`);
  } else if (existsSync(noNextMarker)) {
    if (buildMayHaveRun) purgeNextArtifacts();
    rmSync(noNextMarker);
    if (existsSync(nextLive) && readdirSync(nextLive).length === 0) rmdirSync(nextLive);
    restored.push(`${rel(nextLive)} (static artifacts removed: there was no build before)`);
  }

  if (existsSync(stateFile)) rmSync(stateFile);
  if (readdirSync(stashDir).length === 0) {
    rmdirSync(stashDir);
  } else {
    console.warn(`[build:static] ${rel(stashDir)} still has files in it — inspect it by hand.`);
  }
  stashed = false;
  return restored;
}

/** Last-resort restore for a normal or error exit that skipped the `finally`. */
process.on("exit", () => {
  if (!stashed) return;
  try {
    const restored = restoreSync();
    console.error(`[build:static] restored on exit: ${restored.join(", ") || "nothing"}`);
  } catch (error) {
    console.error(
      `\n[build:static] COULD NOT RESTORE. Your files are in ${rel(stashDir)}.\n` +
        `  app/api       -> ${rel(apiStash)}   (move back to app/api)\n` +
        `  dev types     -> ${rel(devTypesStash)}   (move back to .next/dev/types)\n` +
        `  .next entries -> ${rel(nextStash)}/*   (move back into .next/)\n` +
        `Re-running 'npm run build:static' will try again. (${error.message})`,
    );
  }
});

// ─── Environment ────────────────────────────────────────────────────────────────

/**
 * The `NEXT_PUBLIC_*` values apphosting.yaml sets for Firebase. Parsed with a
 * tiny line scanner rather than a YAML dependency: the file's `env:` list is flat
 * `- variable:` / `value:` pairs. Secrets (`secret:` entries) have no `value:` and
 * are never read.
 */
function readAppHostingPublicEnv() {
  const file = path.join(root, "apphosting.yaml");
  if (!existsSync(file)) return {};
  const found = {};
  let current = null;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*#/.test(line)) continue;
    const variable = line.match(/^\s*-\s*variable:\s*(\S+)\s*$/);
    if (variable) {
      current = variable[1];
      continue;
    }
    const value = line.match(/^\s+value:\s*(.*?)\s*$/);
    if (value && current) {
      found[current] = value[1].replace(/^(["'])(.*)\1$/, "$2");
      current = null;
    }
  }
  return Object.fromEntries(
    Object.entries(found).filter(([key]) => key.startsWith("NEXT_PUBLIC_")),
  );
}

function buildEnv() {
  const fromYaml = readAppHostingPublicEnv();
  const fromShell = Object.fromEntries(
    Object.entries(process.env).filter(([key, value]) => key.startsWith("NEXT_PUBLIC_") && value),
  );
  const publicEnv = { ...fromYaml, ...fromShell };

  if (!publicEnv.NEXT_PUBLIC_SITE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set (and not in apphosting.yaml). The build would bake " +
        "http://localhost:3000 into every canonical tag and the sitemap.",
    );
  }

  const env = {
    ...process.env,
    ...publicEnv,
    STATIC_EXPORT: "1",
    // Always the PHP handler, whatever the shell says: the Node route is not in this build.
    NEXT_PUBLIC_CONTACT_ENDPOINT: CONTACT_ENDPOINT,
  };
  return { env, publicEnv: { ...publicEnv, NEXT_PUBLIC_CONTACT_ENDPOINT: CONTACT_ENDPOINT } };
}

// ─── next build ─────────────────────────────────────────────────────────────────

let child = null;
let interrupted = false;

function killChild() {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === "win32") {
    // `next build` fans out to worker processes; /T takes the whole tree so none of
    // them is still holding .next open when we try to move it back.
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}

// SIGBREAK is Windows-only (Ctrl+Break); elsewhere it is just an event nobody emits.
const SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"];

/**
 * Ctrl+C must not leave app/api parked. Handling the signal (instead of letting
 * it kill us) lets the build stop, and then the `finally` in main() restores.
 */
function onSignal(signal) {
  interrupted = true;
  console.error(`\n[build:static] ${signal} — stopping the build and restoring…`);
  killChild();
}
for (const signal of SIGNALS) process.on(signal, onSignal);

/** Once everything is back in place, Ctrl+C should just work again. */
function releaseSignals() {
  for (const signal of SIGNALS) process.off(signal, onSignal);
}

function runNextBuild(env) {
  return new Promise((resolve, reject) => {
    if (interrupted) return reject(new Error("interrupted"));
    const nextBin = require.resolve("next/dist/bin/next");
    child = spawn(process.execPath, [nextBin, "build"], { cwd: root, env, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      child = null;
      if (interrupted) reject(new Error("interrupted"));
      else if (code === 0) resolve();
      else reject(new Error(`next build failed (${signal ?? `exit code ${code}`})`));
    });
  });
}

// ─── .htaccess ──────────────────────────────────────────────────────────────────

/** Escape for an Apache double-quoted argument. mod_headers also reads `%{x}e`, so refuse a bare `%`. */
function quote(value) {
  if (value.includes("%")) {
    throw new Error(`Header value contains '%', which mod_headers would interpret: ${value}`);
  }
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const COMPRESSIBLE_TYPES = [
  "text/html",
  "text/plain",
  "text/xml",
  "text/css",
  "text/javascript",
  "application/javascript",
  "application/json",
  "application/xml",
  "application/manifest+json",
  "image/svg+xml",
].join(" ");

async function generateHtaccess(siteUrl) {
  const { securityHeaders, assetCacheControl } = await import(
    pathToFileURL(path.join(root, "config", "security-headers.mjs")).href
  );

  const host = new URL(siteUrl).hostname;
  const apex = host.startsWith("www.") ? host.slice("www.".length) : null;
  const hostPattern = apex
    ? `^(www\\.)?${escapeRegex(apex)}(:[0-9]+)?$`
    : `^${escapeRegex(host)}(:[0-9]+)?$`;

  const headerLines = securityHeaders
    .map(({ key, value }) => `  Header always set ${key} ${quote(value)}`)
    .join("\n");

  // The redirects are scoped to the canonical host so the site still answers on a
  // temporary cPanel URL or an IP while DNS is being moved. Two paths are excluded
  // from both:
  //   - `.well-known`: AutoSSL / Let's Encrypt domain validation over plain HTTP
  //     must never be redirected away.
  //   - `/api/contact.php`: it takes JSON POSTs, and a 301/302 makes the client
  //     replay a POST as a GET (the body is lost and the handler answers 405).
  //     The form calls it by a relative URL from an already-canonical https page,
  //     so a visitor never reaches it through a redirect anyway.
  const redirects = `<IfModule mod_rewrite.c>
  RewriteEngine On

  # http -> https
  RewriteCond %{REQUEST_URI} !^/\\.well-known/
  RewriteCond %{REQUEST_URI} !^/api/contact\\.php$
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https [NC]
  RewriteCond %{HTTP_HOST} ${hostPattern} [NC]
  RewriteRule ^ https://${host}%{REQUEST_URI} [L,R=301]
${
  apex
    ? `
  # ${apex} -> ${host}
  RewriteCond %{REQUEST_URI} !^/\\.well-known/
  RewriteCond %{REQUEST_URI} !^/api/contact\\.php$
  RewriteCond %{HTTP_HOST} ^${escapeRegex(apex)}(:[0-9]+)?$ [NC]
  RewriteRule ^ https://${host}%{REQUEST_URI} [L,R=301]
`
    : ""
}</IfModule>`;

  return `# ─────────────────────────────────────────────────────────────────────────────
# Southeast Media — Apache / LiteSpeed (cPanel) configuration.
#
# GENERATED by scripts/build-static.mjs. Do not edit by hand: change the
# generator (or config/security-headers.mjs) and run \`npm run build:static\`.
# Upload this file with the rest of out/. It is a dotfile, so make sure your FTP
# client / cPanel File Manager is set to show and transfer hidden files.
#
# Everything here is the cPanel equivalent of what next.config.ts \`headers()\`
# does on Firebase, plus the routing a CDN would otherwise give us.
# ─────────────────────────────────────────────────────────────────────────────

# Next exports every route as <route>/index.html (trailingSlash: true), so the
# stock directory index is the whole router. /pharma -> /pharma/ is mod_dir's own
# redirect.
DirectoryIndex index.html
Options -Indexes
AddDefaultCharset UTF-8
ErrorDocument 404 /404.html

# ─── Never serve the contact handler's secrets or logs over HTTP ─────────────
# Matched by file name, anywhere in the tree:
#   contact-config*   the real config (API key, recipient) and any backup of it
#   *.sample.php      the template; harmless, but there is no reason to publish it
#   error_log         PHP's per-folder log, which cPanel drops next to a failing
#   php_errorlog      script (api/error_log) and which can name paths and causes
# Works on Apache 2.4 and LiteSpeed; the second block is the Apache 2.2 spelling.
# /api/contact.php is deliberately NOT matched: it is the form's endpoint, and
# none of the rewrite rules below touch it.
<FilesMatch "^(contact-config.*|.*\\.sample\\.php|error_log|php_errorlog)$">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

# ─── HTTPS and canonical host ────────────────────────────────────────────────
# Scoped to ${host}${apex ? ` and ${apex}` : ""}. Any other hostname (a temporary cPanel URL,
# an IP) is served as-is, so the site can be checked before DNS moves. The
# X-Forwarded-Proto test stops a redirect loop behind a TLS-terminating proxy or
# Cloudflare, where %{HTTPS} reads "off" on the origin. /api/contact.php and
# /.well-known/ are never redirected (a redirect turns the form's POST into a
# GET, and breaks AutoSSL domain validation).
${redirects}

# ─── MIME types ──────────────────────────────────────────────────────────────
# Leave .txt alone (text/plain): a static export's router fetches its page data
# as index.txt and __next.*.txt, and only accepts them as text/plain.
<IfModule mod_mime.c>
  AddType video/mp4 .mp4 .m4v
  AddType video/webm .webm
  AddType image/avif .avif
  AddType image/webp .webp
  AddType font/woff2 .woff2
  AddType image/svg+xml .svg
  AddType text/javascript .js .mjs
  AddType application/manifest+json .webmanifest
</IfModule>

# ─── Compression ─────────────────────────────────────────────────────────────
# Text only. Film, stills and fonts are already compressed; gzipping them just
# burns CPU. Brotli first, gzip as the fallback for clients without \`br\`.
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS ${COMPRESSIBLE_TYPES}
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE ${COMPRESSIBLE_TYPES}
</IfModule>

# ─── Response headers ────────────────────────────────────────────────────────
<IfModule mod_headers.c>
  # Baseline security headers on every response, including 404s and redirects.
  # Same list as the Firebase build (config/security-headers.mjs).
${headerLines}

  # PHP announces itself; Next's poweredByHeader is off on the Firebase build too.
  Header always unset X-Powered-By

  # Cache rules. Matched with SetEnvIf on the URL path rather than <If> /
  # <LocationMatch>, because those are not available in .htaccess on LiteSpeed.
  <IfModule mod_setenvif.c>
    # /media and /brand: a day fresh, a week stale-while-revalidate. NOT immutable —
    # the files are overwritten in place (same value as next.config.ts).
    SetEnvIf Request_URI "^/(media|brand)/" asset_cache=1
    Header set Cache-Control ${quote(assetCacheControl)} env=asset_cache

    # /_next/static: filenames carry a content hash, so they never change.
    SetEnvIf Request_URI "^/_next/static/" next_static=1
    Header set Cache-Control "public, max-age=31536000, immutable" env=next_static
  </IfModule>

  # HTML and the RSC payloads (.txt) name hashed chunk files that change on every
  # deploy, so they must always be revalidated. robots.txt, sitemap.xml and
  # llms.txt are covered too. Revalidation is a cheap 304.
  <FilesMatch "\\.(html|txt|xml)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
`;
}

// ─── Post-build ─────────────────────────────────────────────────────────────────

/**
 * Work around a Next 16.2.10 bug that only bites a static export built on Windows.
 *
 * The client router prefetches each route's page segment from a FLAT file name,
 * `/contact/__next.contact.__PAGE__.txt`. The exporter derives that name from
 * `path.relative()`, which joins with a backslash on Windows, so what it actually
 * writes is a NESTED folder: `contact/__next.contact/__PAGE__.txt`. Every one of
 * those prefetches then 404s (and on Apache each 404 returns the full 404.html), and
 * the router quietly falls back to downloading the whole page payload on navigation.
 *
 * Folding the nested path back into the flat name is idempotent, and a no-op on
 * Linux/macOS, where Next already writes the flat names.
 */
function flattenSegmentFiles(dir = outDir) {
  let moved = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || ["_next", "media", "brand", "api"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      moved += flattenSegmentFiles(full);
      continue;
    }
    for (const file of listFiles(full, () => true)) {
      const flat = path.join(dir, path.relative(dir, file).split(path.sep).join("."));
      if (existsSync(flat))
        throw new Error(`${rel(flat)} already exists; cannot flatten ${rel(file)}`);
      renameSync(file, flat);
      moved++;
    }
    removeTree(full);
  }
  return moved;
}

function copyStaticHost() {
  if (!existsSync(hostDir)) {
    console.warn(
      `[build:static] ${rel(hostDir)}/ not found — nothing copied. The form posts to ${CONTACT_ENDPOINT}, which will 404.`,
    );
    return false;
  }
  if (existsSync(path.join(hostDir, ".htaccess"))) {
    console.warn(
      `[build:static] ${rel(hostDir)}/.htaccess is replaced by the generated out/.htaccess.`,
    );
  }
  cpSync(hostDir, outDir, { recursive: true, filter: (src) => !isHostOnlyFile(src) });
  return true;
}

/**
 * Files in static-host/ that exist for the repo, not the server: the setup README
 * and the .gitignore that keeps the real config out of git. The PHP handler and
 * `contact-config.sample.php` DO ship — the owner copies the sample to
 * `contact-config.php` on the server.
 */
function isHostOnlyFile(src) {
  return /(^|[\\/])(README\.md|\.gitignore|\.DS_Store|Thumbs\.db)$/.test(src);
}

function listFiles(dir, predicate, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, found);
    else if (predicate(full)) found.push(full);
  }
  return found;
}

/** Routes = every app/**\/page.tsx, as the URL path Next will have exported. */
function expectedRoutes() {
  return listFiles(path.join(root, "app"), (f) => path.basename(f) === "page.tsx").map((file) => {
    const segments = path
      .relative(path.join(root, "app"), path.dirname(file))
      .split(path.sep)
      .filter((segment) => segment && !/^\(.*\)$/.test(segment));
    return "/" + segments.join("/");
  });
}

function verifyOutput() {
  const problems = [];
  const need = (relative) => {
    if (!existsSync(path.join(outDir, relative))) problems.push(`missing out/${relative}`);
  };

  [
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    ".htaccess",
    "media",
    "_next/static",
  ].forEach(need);

  const routes = expectedRoutes();
  for (const route of routes) {
    need(path.posix.join(route, "index.html").replace(/^\//, ""));
    // The page-segment prefetch file the client router requests, by its flat name.
    const dotted = route === "/" ? "" : "." + route.slice(1).replaceAll("/", ".");
    need(path.posix.join(route, `__next${dotted}.__PAGE__.txt`).replace(/^\//, ""));
  }
  const nestedSegmentDirs = listFiles(outDir, (f) => /[\\/]__next\.[^\\/]+[\\/]/.test(f));
  if (nestedSegmentDirs.length) {
    problems.push(`nested segment files remain (client would 404): ${rel(nestedSegmentDirs[0])}`);
  }

  const html = listFiles(outDir, (f) => f.endsWith(".html"));
  const withOptimizer = html.filter((f) => readFileSync(f, "utf8").includes("/_next/image"));
  if (withOptimizer.length) {
    problems.push(`/_next/image still referenced in: ${withOptimizer.map(rel).join(", ")}`);
  }

  // The endpoint is inlined into a client chunk, not the HTML. Make sure the env
  // really reached the bundle, and the Node route's URL did not.
  const chunks = listFiles(path.join(outDir, "_next", "static", "chunks"), (f) =>
    f.endsWith(".js"),
  ).map((f) => readFileSync(f, "utf8"));
  if (!chunks.some((code) => code.includes(CONTACT_ENDPOINT))) {
    problems.push(
      `no client chunk contains ${CONTACT_ENDPOINT} — the form would post to the wrong URL`,
    );
  }
  if (chunks.some((code) => /["'`]\/api\/contact["'`]/.test(code))) {
    problems.push(`a client chunk still posts to the bare /api/contact`);
  }

  return { problems, routes, htmlCount: html.length };
}

function directorySize(dir) {
  return listFiles(dir, () => true).reduce((sum, f) => sum + statSync(f).size, 0);
}

// ─── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  // (a) A previous run was killed before it could restore. Put things back and stop,
  //     so the working tree can be inspected before anything is moved again.
  if (existsSync(stashDir)) {
    step(`found ${rel(stashDir)} from an interrupted run — restoring`);
    stashed = true;
    const restored = restoreSync();
    log(`restored: ${restored.join(", ") || "nothing to move"}`);
    log("Check `git status`, then run `npm run build:static` again.");
    process.exitCode = 1;
    return;
  }

  if (filesUnder(apiLive).length === 0) {
    throw new Error(
      `${rel(apiLive)} has no files in it and there is no stash to restore it from. ` +
        `Restore it first: git checkout -- app/api`,
    );
  }

  const { env, publicEnv } = buildEnv();
  step("environment");
  for (const [key, value] of Object.entries(publicEnv)) log(`  ${key}=${value}`);

  removeTree(outDir);

  step("moving app/api and .next aside");
  try {
    stashAway();
    step("next build  (STATIC_EXPORT=1)");
    await runNextBuild(env);
  } finally {
    const restored = restoreSync();
    step(`restored: ${restored.join(", ") || "nothing"}`);
    releaseSignals();
  }
  if (interrupted) throw new Error("interrupted");

  if (!existsSync(path.join(outDir, "index.html"))) {
    throw new Error("next build finished but out/index.html does not exist.");
  }

  const flattened = flattenSegmentFiles();
  if (flattened) {
    step(
      `fixed ${flattened} route-segment file name(s) the Windows exporter nested (see flattenSegmentFiles)`,
    );
  }

  step("copying static-host/ into out/");
  const copied = copyStaticHost();
  if (copied) {
    for (const file of listFiles(hostDir, (f) => !isHostOnlyFile(f))) {
      log(`  out/${path.relative(hostDir, file).split(path.sep).join("/")}`);
    }
  }

  step("writing out/.htaccess");
  writeFileSync(
    path.join(outDir, ".htaccess"),
    await generateHtaccess(publicEnv.NEXT_PUBLIC_SITE_URL),
  );

  step("verifying out/");
  const { problems, routes, htmlCount } = verifyOutput();
  log(`  routes: ${routes.length} (${routes.join(" ")})`);
  log(`  html files: ${htmlCount}`);
  log(`  size: ${(directorySize(outDir) / 1024 / 1024).toFixed(1)} MB`);

  if (problems.length) {
    console.error("\n[build:static] PROBLEMS:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
    return;
  }

  log("\n[build:static] done. Upload the contents of out/ (including .htaccess) to public_html.");
}

main().catch((error) => {
  console.error(
    error.message === "interrupted"
      ? "\n[build:static] interrupted; app/api and .next were restored."
      : `\n[build:static] ${error.message}`,
  );
  process.exitCode = interrupted ? 130 : 1;
});
