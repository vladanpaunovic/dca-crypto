import Head from "next/head";
import Navigation from "../components/Navigarion/Navigation";
import { useRouter } from "next/router";
import AllCoinsTable from "../components/AllCoinsTable/AllCoinsTable";

export default function Coin() {
  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average cryptocurrency</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className="w-full bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto max-w-80 bg-white dark:bg-gray-900">
          <div className="col-span-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 mb-5">
              Dollar-cost averaging (DCA) calculator for your{" "}
              <span className="text-indigo-700 dark:text-yellow-500 font-bold">
                crypto
              </span>
            </h1>
            <p className="text-gray-900 dark:text-white mb-2">Select coin:</p>
          </div>
          <AllCoinsTable />
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CRYPTO
      </footer>
    </div>
  );
}
