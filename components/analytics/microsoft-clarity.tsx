import Script from "next/script";

/**
 * Microsoft Clarity — session replay and heatmaps.
 *
 * The second and last third party on the site, alongside GA4. The two do not
 * overlap: GA4 counts what happened, Clarity records how. Neither reads the
 * other's data and both are mounted exactly once, from the root layout.
 *
 * WHY THE OFFICIAL SNIPPET AND NOT A BARE `<Script src=…>`. The stub this
 * defines — `window.clarity` as a queue that buffers calls until the real tag
 * lands — is the whole reason Microsoft ships a snippet rather than a script
 * URL. Without it, any `clarity('set', …)` or `clarity('identify', …)` fired
 * before the tag finishes downloading throws instead of being replayed. Nothing
 * on the site calls it today; keeping the stub means adding a custom tag later
 * is a one-liner rather than a race.
 *
 * WHY `next/script` AND NOT A RAW `<script>`. This is the opposite case to
 * `components/seo/json-ld.tsx`, which must be in the served HTML on the first
 * byte for crawlers. Analytics must NOT be: at the default `afterInteractive`
 * strategy Next injects this client-side once hydration is under way, so the
 * prerendered HTML is byte-identical with and without it. That is what keeps
 * all 17 routes statically rendered and makes a hydration mismatch impossible —
 * the same reasoning as the `GoogleAnalytics` mount in the root layout.
 *
 * The `id` is required by `next/script` for inline scripts; it is what Next
 * dedupes on, so this cannot execute twice even across client navigations.
 *
 * THE HOSTS THIS NEEDS ARE ALLOWLISTED IN THE CSP in next.config.ts. Without
 * those entries the tag is blocked and the dashboard stays empty — the console
 * names the directive.
 */
export function MicrosoftClarity({ projectId }: { projectId: string }) {
  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        /**
         * Microsoft's published snippet verbatim, with the project ID injected
         * as a JSON string literal rather than pasted between quotes.
         *
         * `JSON.stringify` because this is raw HTML injection and the ID comes
         * from the environment: it quotes and escapes in one step, so a value
         * carrying a quote or a backslash cannot break out of the literal. The
         * `<` replace closes the other half of the same hole — a `</script>` in
         * the value would otherwise end this tag early and drop the remainder
         * into the document as markup.
         */
        __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId).replace(/</g, "\\u003c")});`,
      }}
    />
  );
}
