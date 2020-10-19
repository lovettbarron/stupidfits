import Document, { Html, Head, Main, NextScript } from "next/document";

import { GA_TRACKING_ID } from "../lib/gtag";
import { NextSeo, DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <NextSeo
            title="Using More of Config"
            description="This example uses more of the available config options."
            canonical="https://www.canonical.ie/"
            openGraph={{
              type: "website",
              locale: "en_US",
              url: "https://stupidfits.com",
              site_name: "Stupid Fits",
              description: "All the fits instagram has to offer",
              images: [
                {
                  url: "https://stupidfits.com/img/appicon.png",
                  width: 1024,
                  height: 1024,
                  alt: "Og Image Alt",
                },
              ],
            }}
            facebook={{
              appId: "2742481926027884",
            }}
            twitter={{
              handle: "@readywater",
              site: "@stupid_systems",
              cardType: "summary_large_image",
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <script
          data-ad-client={"ca-pub-9045265332202021"}
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
      </Html>
    );
  }
}
