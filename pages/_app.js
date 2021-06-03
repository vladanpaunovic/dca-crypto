import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "next-themes";
import { Provider } from "next-auth/client";
import { ReactQueryDevtools } from "react-query/devtools";
import * as Sentry from "@sentry/react";
import { Hydrate } from "react-query/hydration";

export const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
            <ReactQueryDevtools />
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default Sentry.withProfiler(App);
