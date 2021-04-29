import Head from "next/head";
import { AppContextProvider } from "../components/Context/Context";
import Register from "../components/Register/Register";

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Head>
        <title>DCA Crypto - Register</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Dollar cost average calculator for top 100 cryptocurrencies. Visualise and examine the impact of your investments in crypto."
        />
      </Head>
      <Register />
    </AppContextProvider>
  );
}
