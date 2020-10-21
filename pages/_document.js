import Document, { Html, Head, Main, NextScript } from "next/document";

import { GA_TRACKING_ID } from "../lib/gtag";
import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    const stylesheets = styletron.getStylesheets() || [];
    return { ...initialProps, stylesheets };
  }

  render() {
    return (
      <Html>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs["data-hydrate"]}
              key={i}
            />
          ))}
          {process.env.HOST !== "https://stupdifits.com" && (
            <meta name="robots" content="noindex" />
          )}
          <meta property="og:title" content="Stupid Fits" key="title" />
          {/* <meta property="og:url" content={process.env.HOST} key="url" /> */}
          {/* <meta property="og:type" content="website" key="type" /> */}
          <meta
            name="keywords"
            content="fitpics, outfits, techwear, clueless, closet, fits"
          />
          <meta property="fb:app_id" content={process.env.FACEBOOK_CLIENT_ID} />

          <meta property="og:site_name" content="Stupid Fits" />
          <meta property="og:locale" content="en_US" />

          <meta property="og:locale:alternate" content="en_DK" />
          <meta property="og:locale:alternate" content="cn_CN" />

          <meta property="og:image:width" content="1024" />
          <meta property="og:image:height" content="1024" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <script
            data-ad-client="ca-pub-9045265332202021"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        {/* <script
          data-ad-client={"ca-pub-9045265332202021"}
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        /> */}
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
