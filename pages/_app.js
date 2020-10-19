import React, { useEffect, useState } from "react";
import { BaseProvider, DarkTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider } from "next-auth/client";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import Head from "next/head";

function App({ Component, pageProps }) {
  const [engine, setEngine] = useState(null);
  useEffect(() => {
    // Load the `styletron-engine-atomic` package dynamically.
    // Reason: It requires use of `document`, which is not available
    // outside the browser, so we need to wait until it successfully loads.
    // Source: https://www.gatsbyjs.org/docs/debugging-html-builds/
    import("styletron-engine-atomic").then((styletron) => {
      const clientEngine = new styletron.Client();
      setEngine(clientEngine);
    });
  }, []);

  // Sentry.init({
  //   dsn:
  //     "https://e54eb37c1dba4eb2b24f48c4dfdf004d@o210816.ingest.sentry.io/5462595",
  //   integrations: [new Integrations.BrowserTracing()],
  //   enabled: process.env.NODE_ENV === "production",
  //   // We recommend adjusting this value in production, or using tracesSampler
  //   // for finer control
  //   tracesSampleRate: 1.0,
  // });

  if (!engine) return null;
  return (
    // <Provider session={pageProps.session}>
    <>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <title>Stupid Fits | Digital Fit Library for all your Fabrics</title>
        {process.env.HOST !== "https://stupdifits.com" && (
          <meta name="robots" content="noindex" />
        )}
        <meta property="og:title" content="Stupid Fits" key="title" />
        <meta property="og:url" content={process.env.HOST} key="url" />
        <meta property="og:type" content="website" key="type" />
        <meta
          name="keywords"
          content="fitpics, outfits, techwear, clueless, closet, fits"
        />
        <meta property="fb:app_id" content={process.env.FACEBOOK_CLIENT_ID} />

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
          key="mainimg"
        />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
      </Head>
      <Provider
        options={{ site: process.env.HOST }}
        session={pageProps.session}
      >
        <StyletronProvider value={engine}>
          <BaseProvider theme={DarkTheme}>
            <Component {...pageProps} url={process.env.HOST} />
          </BaseProvider>
        </StyletronProvider>
      </Provider>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default App;
