import React, { useEffect, useState } from "react";
import { BaseProvider, DarkTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
// import { Client as Styletron } from "styletron-engine-atomic";
import { Client, Server } from "styletron-engine-atomic";

import { Provider } from "next-auth/client";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import Head from "next/head";
import Transition from "../components/Transition";
import Header from "../components/Header";
import { styletron, getHydrateClass, debug } from "../styletron";

function App({ Component, pageProps, router }) {
  useEffect(() => {
    // Load the `styletron-engine-atomic` package dynamically.
    // Reason: It requires use of `document`, which is not available
    // outside the browser, so we need to wait until it successfully loads.
    // Source: https://www.gatsbyjs.org/docs/debugging-html-builds/
    // import("styletron-engine-atomic").then((styletron) => {
    //   const clientEngine = new styletron.Client();
    //   setEngine(clientEngine);
    // });
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

  return (
    <>
      <DefaultSeo {...SEO} />
      <Head>
        <title>Stupid Fits | Digital Fit Library for all your Fabrics</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider
        options={{ site: process.env.HOST }}
        session={pageProps.session}
      >
        <StyletronProvider value={styletron} debugAfterHydration debug={debug}>
          <BaseProvider theme={DarkTheme}>
            <Transition location={router.pathname}>
              <Header />
              <Component
                {...pageProps}
                url={process.env.HOST}
                key={router.route}
              />
            </Transition>
          </BaseProvider>
        </StyletronProvider>
      </Provider>
    </>
  );
}

export default App;
