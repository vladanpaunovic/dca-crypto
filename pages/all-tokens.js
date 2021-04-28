import Head from "next/head";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import AllTokensHero from "../components/Hero/AllTokensHero";
import { defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  return {
    props: {
      availableTokens,
    },
  };
}

export default function HomeWrapper(props) {
  return (
    <AppContextProvider availableTokens={props.availableTokens}>
      <Home {...props} />
    </AppContextProvider>
  );
}

function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average cryptocurrency</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full bg-white dark:bg-gray-900">
        <AllTokensHero />
        <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900 mt-10">
          <AllCoinsTable showSearch />
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CC - Dollar Cost Averaging Cryptocurrency
      </footer>
    </div>
  );
}
