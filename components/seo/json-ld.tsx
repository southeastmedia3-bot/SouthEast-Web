/**
 * Renders a schema.org graph as inline JSON-LD.
 *
 * WHY `<script>` AND NOT `next/script`. This has to be in the served HTML on the
 * first byte, because a crawler that does not execute JavaScript still has to
 * see it — and every route here is prerendered, so an inline script tag in the
 * component tree is baked straight into the static HTML at build time. Wrapping
 * it in `next/script` would only add a strategy that defers it.
 *
 * WHY `dangerouslySetInnerHTML`. React escapes text children, which would turn
 * the JSON's quotes into `&quot;` and hand the crawler an unparseable blob. The
 * payload has to go in raw, which is what this attribute is for and why Google's
 * own Next.js guidance uses it here.
 *
 * THE `<` REPLACE IS NOT COSMETIC. Raw HTML injection means a `<` inside
 * any string in the graph could close this tag early — a description containing
 * `</script>` would end the block and drop whatever followed into the document
 * as markup. Everything fed in here is currently authored content from
 * `data/seo.ts`, but this component cannot know that, so it escapes at the
 * boundary. `<` is a valid JSON escape for `<` and parses back identically.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
