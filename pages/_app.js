import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "next-themes";
import { Provider } from "next-auth/client";

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
