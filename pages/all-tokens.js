import Head from "next/head";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import { AppContextProvider } from "../components/Context/Context";
import Footer from "../components/Footer/Footer";
import AllTokensHero from "../components/Hero/AllTokensHero";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../config";
import { getAllCoins } from "../queries/queries";

export async function getServerSideProps(context) {
  const availableTokens = await getAllCoins(
    context.query.currency || defaultCurrency
  );

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
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
      <AllTokens {...props} />
    </AppContextProvider>
  );
}

function AllTokens(props) {
  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average cryptocurrency</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={`List of all cryptocurrencies available for calculating dollar cost average. Visualise and examine the impact of your investments in top 100 cryptocurrencies.`}
        />
      </Head>
      <main className="w-full bg-white dark:bg-gray-900">
        <AllTokensHero />
        <div className="container lg:px-6 max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900 mt-10">
          <AllCoinsTable showSearch />
        </div>
      </main>

      <Footer availableTokens={props.availableTokens} />
    </div>
  );
}
