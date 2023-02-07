"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import CookieBanner from "../components/CookieBanner/CookieBanner";
import { useState } from "react";
import DefaultSeo from "../components/Seo/DefaultSeo";

function Providers({ children, session }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <CookieBanner />
        <DefaultSeo />
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Providers;
