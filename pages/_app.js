import "../styles/globals.css";
import { QueryClientProvider } from "react-query";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";
import CookieBanner from "../components/CookieBanner/CookieBanner";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DefaultSeo from "../components/Seo/DefaultSeo";
import { WEBSITE_PATHNAME } from "../config";
import { SessionProvider } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";
import { setFingerprintCookie } from "../src/fingerprinting";
import NextNProgress from "nextjs-progressbar";
import queryClient from "../src/queryClient";
import PlausibleProvider from "next-plausible";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://eu.i.posthog.com",
    person_profiles: "always",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      Sentry.setContext("route changed", { url: `${WEBSITE_PATHNAME}${url}` });
    };

    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    setFingerprintCookie();

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <PostHogProvider client={posthog}>
      <PlausibleProvider domain="dca-cc.com" enabled={true}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <CookieBanner />
                <DefaultSeo />
                <NextNProgress height={5} color="#4338CA" />

                <Component {...pageProps} />
                <ReactQueryDevtools />
              </Hydrate>
            </QueryClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </PlausibleProvider>
    </PostHogProvider>
  );
}

export default App;
