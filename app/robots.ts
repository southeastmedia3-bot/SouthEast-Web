import { createRobots } from "@/lib/seo";

/**
 * Explicit, because `output: "export"` (the cPanel build, `npm run build:static`)
 * refuses a metadata route that does not declare itself static. It is already
 * prerendered on every other build — this only states it — so the Firebase output
 * is unchanged.
 */
export const dynamic = "force-static";

export default function robots() {
  return createRobots();
}
