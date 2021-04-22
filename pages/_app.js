import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { AppWrapper, useAppContext } from "../components/Context/Context";

const queryClient = new QueryClient();

function App(props) {
  return (
    <AppWrapper>
      <QueryClientProvider client={queryClient}>
        <RenderComponent {...props} />
      </QueryClientProvider>
    </AppWrapper>
  );
}

const RenderComponent = ({ Component, pageProps }) => {
  const appContext = useAppContext();
  return (
    <div
      className={`${
        appContext.state.settings.darkMode ? "bg-gray-900 dark" : ""
      }`}
    >
      <Component {...pageProps} />
    </div>
  );
};

export default App;
