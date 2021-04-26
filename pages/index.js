import Head from "next/head";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";
import Hero from "../components/Hero/Hero";

export default function Coin() {
  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average cryptocurrency</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full bg-white dark:bg-gray-900">
        <Hero />
        <div className="container max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900">
          <h3 className="font-medium dark:text-white mt-4">
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
