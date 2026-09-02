const GTM_ID = process.env.GTM_CONTAINER_ID;

/**
 * Google Tag Manager — mounted once in the root layout.
 * Injects Google's standard snippet inline so the gtm.js loader is present in
 * the server-rendered HTML itself (required for Google's "Test your website"
 * tool and crawlers that read raw HTML, which next/script's deferred
 * afterInteractive injection would hide).
 *
 * Server component: reads GTM_CONTAINER_ID from the server environment (set
 * it in Vercel project env settings). No-ops when it is not configured.
 * The noscript <iframe> fallback covers browsers without JavaScript.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
