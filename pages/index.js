import Head from "next/head";
import Navigation from "../components/Navigarion/Navigation";
import { useAppContext } from "../components/Context/Context";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Coin() {
  const { state } = useAppContext();
  const router = useRouter();

  return (
    <div className="w-full">
      <Head>
        <title>DCA Crypto - Dollar cost average {router.query.coin}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className="flex justify-center">
        <div className="mt-4 container bg-white dark:bg-gray-900">
          <div className="col-span-6">
            <h1 className="text-2xl text-gray-900 dark:text-gray-100 mb-5">
              Dollar-cost averaging (DCA) calculator for your{" "}
              <span className="text-indigo-700 dark:text-yellow-500 font-bold">
                crypto
              </span>
            </h1>
            <p className="text-gray-900 dark:text-white mb-2">Select coin:</p>
          </div>
          <ul>
            {state.settings.availableTokens
              ? state.settings.availableTokens.map((coin, index) => (
                  <li
                    key={coin.id}
                    className={`dark:text-gray-200 border rounded-none hover:bg-gray-100 ${
                      index === 0 ? "rounded-t" : ""
                    } ${
                      index === state.settings.availableTokens.length - 1
                        ? "rounded-b"
                        : ""
                    }`}
                  >
                    <Link href={`/dca/${coin.id}`}>
                      <a className="flex items-center px-2 py-4 justify-between hover:opacity-80">
                        #{coin.market_cap_rank} {coin.name}
                        <img className="w-7" src={coin.image} />
                      </a>
                    </Link>
                  </li>
                ))
              : "Loading..."}
          </ul>
        </div>
      </main>

      <footer className="w-100 flex border-t h-20 justify-center items-center dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900">
        DCA CRYPTO
      </footer>
    </div>
  );
}
