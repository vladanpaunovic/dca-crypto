import Head from "next/head";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import {
  AppContextProvider,
  useAppContext,
} from "../components/Context/Context";
import Hero from "../components/Hero/Hero";
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
    <AppContextProvider availableTokens={availableTokens}>
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
        <Hero />
        <div className="container max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900">
          <h3 className="font-medium text-indigo-500 dark:text-white mt-4 px-4 xl:px-0">
            Select coin to calculate DCA
          </h3>
          <AllCoinsTable />
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CC - Dollar Cost Averaging Cryptocurrency
      </footer>
    </div>
  );
}
