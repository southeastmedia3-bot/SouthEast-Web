/**
 * Which files under `public/media` nothing on the site points at.
 *
 * A HOUSEKEEPING AID, NOT AN ORACLE. Its output is a shortlist to look at, never
 * a delete list to pipe into `rm`. Two earlier versions of this script were each
 * confidently wrong in a way worth writing down, because both mistakes are the
 * obvious way to write it:
 *
 *   IT READ FOUR DATA FILES. `data/media.ts`, `home.ts`, `verticals.ts`,
 *   `about.ts` — and nothing else. But `data/pharma.ts`, `lib/pharma-media-dims`
 *   and a dozen components name `/media/...` paths of their own, so live assets
 *   came back "unreferenced": `pharma/moa-protein.mp4` and its poster are on the
 *   /pharma page and were reported as never having been on the site. A false
 *   positive here is the dangerous direction — it invites a deletion.
 *
 *   IT MATCHED ON BASENAME. `public/media` has twelve basenames that occur in
 *   both `pharma/deck` and `pharma/slides` (the deck frames are crops of the
 *   slides and keep their names). Matching `family.jpg` anywhere in the source
 *   marks BOTH copies used, so a genuinely dead file hides behind its twin. That
 *   is the quiet direction: the script reports clean and the dead weight ships.
 *
 * So: every source file is read, aliases are resolved (see `expandAliases`), and
 * matching is on the full public-relative path. The one concession is the
 * templated path — `data/media.ts` builds the deck library as
 * `/media/pharma/deck/${slug}.jpg`, and no literal-path match can see those. Any
 * directory that appears in source with an interpolation in it is treated as
 * templated, and a file under it counts as used when its stem occurs in the
 * source as a whole word. Loose on purpose: this is the branch that decides
 * whether a real image gets called dead. It reports zero today, because
 * `lib/pharma-media-dims.ts` happens to spell all thirty-two deck paths out in
 * full — it is here for the next library authored the way the deck is.
 *
 * Run: `node scripts/unused-media.mjs`
 */

import fs from "node:fs";
import path from "node:path";

/** Where the site's code lives. Anything outside this — `docs/`, the READMEs —
 *  is prose about the media, not a reference from a page, and a file mentioned
 *  only in a document is exactly what this script is looking for. */
const SOURCE_DIRS = [
  "app",
  "components",
  "config",
  "constants",
  "data",
  "hooks",
  "lib",
  "scripts",
  "styles",
  "types",
  "utils",
];

/** Root-level config that can name a media path (`next.config.ts` and friends). */
const SOURCE_ROOT_FILES = ["next.config.ts", "apphosting.yaml", "firebase.json"];

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".json"]);

function walk(dir, keep = () => true) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name).split(path.sep).join("/");
    if (entry.isDirectory()) out.push(...walk(p, keep));
    else if (keep(p)) out.push(p);
  }
  return out;
}

/**
 * Almost nothing in `data/` writes a media path out in full. The libraries are
 * authored against a directory alias — `const G = "/media/generated"` and then
 * `${G}/showreel.mp4` — which is right for the data files and invisible to a
 * regex looking for `/media/`. So each file is read, its own aliases collected,
 * and every `${ALIAS}` in it put back to the directory it stands for before any
 * matching happens. Per file, not across the joined blob: these are file-local
 * consts and a `PH` in one file must not resolve against a `PH` in another.
 */
function expandAliases(text) {
  const aliases = [...text.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*["'](\/media\/[^"']*)["']/g)];
  let out = text;
  for (const [, name, dir] of aliases) {
    out = out.split(`\${${name}}`).join(dir);
  }
  return out;
}

const source = [
  ...SOURCE_DIRS.filter((d) => fs.existsSync(d)).flatMap((d) =>
    walk(d, (p) => SOURCE_EXT.has(path.extname(p))),
  ),
  ...SOURCE_ROOT_FILES.filter((f) => fs.existsSync(f)),
]
  .map((f) => expandAliases(fs.readFileSync(f, "utf8")))
  .join("\n");

/* ── what the source claims to use ───────────────────────────────────────── */

/** Literal paths: `/media/pharma/brain.jpg`, minus any `?v=` cache-busting tag. */
const referenced = new Set(
  [...source.matchAll(/\/media\/[A-Za-z0-9._/-]+/g)].map((m) => m[0].split("?")[0]),
);

/** Templated directories: the `/media/pharma/deck/` of `/media/pharma/deck/${slug}.jpg`. */
const templatedDirs = new Set(
  [...source.matchAll(/\/media\/[A-Za-z0-9._/-]*\/(?=\$\{)/g)].map((m) => m[0]),
);

/** A stem counts as named if it appears as a whole word — `"protein"` in the
 *  deck's slug table, not the `protein` inside `moa-protein`. */
const namedStem = (stem) =>
  new RegExp(`(^|[^A-Za-z0-9-])${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z0-9-]|$)`).test(
    source,
  );

/* ── what is actually on disk ────────────────────────────────────────────── */

const files = walk("public/media").map((p) => p.replace(/^public/, ""));

const unused = [];
const viaTemplate = [];

for (const file of files) {
  if (referenced.has(file)) continue;

  const dir = `${path.posix.dirname(file)}/`;
  if (templatedDirs.has(dir) && namedStem(path.basename(file, path.extname(file)))) {
    viaTemplate.push(file);
    continue;
  }

  unused.push(file);
}

/* ── the report ──────────────────────────────────────────────────────────── */

console.log(
  `total ${files.length} | referenced ${files.length - unused.length}` +
    (viaTemplate.length ? ` (${viaTemplate.length} via a templated path)` : "") +
    ` | unreferenced ${unused.length}`,
);

const byDir = {};
for (const u of unused) (byDir[path.posix.dirname(u)] ??= []).push(path.basename(u));

for (const d of Object.keys(byDir).sort()) {
  console.log(`\n${d} (${byDir[d].length})\n  ${byDir[d].join(" ")}`);
}

if (unused.length) {
  console.log("\nShortlist, not a delete list — check each one on the page before removing it.");
}
