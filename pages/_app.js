import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";
import CookieBanner from "../components/CookieBanner/CookieBanner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as ga from "../components/helpers/GoogleAnalytics";
import DefaultSeo from "../components/Seo/DefaultSeo";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <CookieBanner />
          <DefaultSeo />
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
