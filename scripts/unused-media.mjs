import fs from "node:fs";
import path from "node:path";

const src = ["data/media.ts", "data/home.ts", "data/verticals.ts", "data/about.ts"]
  .map((f) => fs.readFileSync(f, "utf8"))
  .join("\n");

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else files.push(p.split(path.sep).join("/"));
  }
}
walk("public/media");

const unused = files.filter((f) => !src.includes(path.basename(f)));
console.log(`total ${files.length} | unreferenced ${unused.length}`);

const byDir = {};
for (const u of unused) {
  const d = path.dirname(u);
  (byDir[d] ??= []).push(path.basename(u));
}
for (const d of Object.keys(byDir).sort()) {
  console.log(`\n${d} (${byDir[d].length})\n  ${byDir[d].join(" ")}`);
}
