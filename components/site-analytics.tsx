import Script from "next/script"

// One existing GA4 stream follows the journey across the USI websites.
// Host gating keeps preview deployments out of production analytics.
export function SiteAnalytics() {
  if (process.env.NODE_ENV !== "production") return null

  return (
    <Script id="usi-ga4" strategy="afterInteractive">
      {`(function(){
        if (window.location.hostname !== "yosakoi.united-studio.com") return;
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PPENCNYR54', {
          cookie_domain: 'united-studio.com',
          site_type: 'yosakoi'
        });
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PPENCNYR54';
        document.head.appendChild(script);
      })();`}
    </Script>
  )
}

