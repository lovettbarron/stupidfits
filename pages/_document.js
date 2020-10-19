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
          <meta property="og:title" content="Stupid Fits" />
          <meta property="og:url" content={process.env.HOST} />
          <meta
            property="og:description"
            content="Digital Fit Library for all your Fabrics"
          />
          <meta property="og:site_name" content="Stupid Fits" />
          <meta property="og:locale" content="en_US" />

          <meta property="og:locale:alternate" content="en_DK" />
          <meta property="og:locale:alternate" content="cn_CN" />
          <meta
            property="og:image"
            content="https://stupidfits.com/img/appicon.png"
          />
          <meta property="og:image:width" content="1024" />
          <meta property="og:image:height" content="1024" />

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
