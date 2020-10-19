import Document, { Html, Head, Main, NextScript } from "next/document";

import { GA_TRACKING_ID } from "../lib/gtag";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
        <script
          data-ad-client={"ca-pub-9045265332202021"}
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
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
      </Html>
    );
  }
}
