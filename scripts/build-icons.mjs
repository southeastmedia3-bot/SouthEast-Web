/**
 * Builds the site's icon set from the one brand file, `public/brand/logo-mark.png`.
 *
 *   node scripts/build-icons.mjs      (or: npm run icons)
 *
 * Writes app/icon.png (512), app/apple-icon.png (180) and app/favicon.ico
 * (16/32/48/64, PNG-compressed entries). Next's App Router picks all three up by
 * filename — there is no `icons` block in the metadata to keep in sync.
 *
 * THE BACKGROUND IS TRANSPARENT AND MUST STAY TRANSPARENT.
 *
 * These have twice been shipped with something behind the mark — first a black
 * square, then a dark navy rounded tile — and both were rejected for the same
 * reason: the icon is the mark, not a badge of the mark. A browser tab already
 * supplies its own background, and painting one into the file means the icon
 * carries a dark block through every light chrome it lands in. So the canvas is
 * cleared, the mark is scaled to `MARK_WIDTH` of the square and centred, and
 * nothing else is drawn.
 *
 * Two consequences worth knowing before "fixing" this again:
 *
 *  - The mark's fourth stripe is `--brand-ice` (#ebf6ff), so on a white tab strip
 *    that stripe reads as near-nothing and the icon looks like three stripes.
 *    That is the mark's own colour, deliberately kept. Do not add a plate behind
 *    it to make it pop.
 *  - iOS flattens transparency to BLACK when it renders a home-screen icon, so
 *    apple-icon.png will show a black square there. It is left transparent on
 *    purpose for consistency; if that ever needs solving, give the apple icon
 *    alone a LIGHT plate — never a dark one, and never the tab favicon.
 *
 * The mark is 512x200 (2.56:1) and fills its canvas edge to edge, so squaring it
 * means transparent space above and below. That is the shape; do not crop into
 * it to fill the square.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "public/brand/logo-mark.png");

/** Fraction of the square the mark spans. Just shy of the full width, so the
 *  shape never touches the edge of a rounded-off tab or bookmark chip. */
const MARK_WIDTH = 0.94;

/** Sizes packed into favicon.ico. 16 and 32 are the tab and the bookmark bar;
 *  48 and 64 are what Windows and the Chrome new-tab grid reach for. */
const ICO_SIZES = [16, 32, 48, 64];

/** One square, transparent, with the mark centred in it. */
async function square(source, size) {
  const width = Math.round(size * MARK_WIDTH);
  const mark = await sharp(source)
    .resize({ width, kernel: "lanczos3", fit: "inside" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

/**
 * ICO container around already-encoded PNGs. Every browser in support has read
 * PNG-compressed .ico entries for well over a decade, and it keeps the alpha
 * channel intact — a BMP-encoded entry would need its own AND mask.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = header.length + directory.length;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    directory[at] = size >= 256 ? 0 : size; // 0 means 256
    directory[at + 1] = size >= 256 ? 0 : size;
    directory[at + 2] = 0; // palette size — none, it is truecolour
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.data)]);
}

const source = await readFile(SOURCE);

await mkdir(join(root, "app"), { recursive: true });
await writeFile(join(root, "app/icon.png"), await square(source, 512));
await writeFile(join(root, "app/apple-icon.png"), await square(source, 180));
await writeFile(
  join(root, "app/favicon.ico"),
  ico(
    await Promise.all(ICO_SIZES.map(async (size) => ({ size, data: await square(source, size) }))),
  ),
);

console.log(`icons written from ${SOURCE} — transparent, mark only`);
