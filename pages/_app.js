import React, { useEffect, useState } from "react";
import { BaseProvider, DarkTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider } from "next-auth/client";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

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
    <Provider options={{ site: process.env.HOST }} session={pageProps.session}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={DarkTheme}>
          <Component {...pageProps} url={process.env.HOST} />
        </BaseProvider>
      </StyletronProvider>
    </Provider>
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
