import Head from "next/head";
import Navigation from "../components/Navigarion/Navigation";
import { useAppContext } from "../components/Context/Context";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import Link from "next/link";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

export default function Coin() {
  const { state } = useAppContext();
  const router = useRouter();

  const { data } = useQuery("coins", () =>
    axios.get(API_URL, {
      params: {
        vs_currency: state.settings.currency,
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    })
  );

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
            {data
              ? data.data.map((coin, index) => (
                  <li
                    key={coin.id}
                    className={`dark:text-gray-200 border rounded-none hover:bg-gray-100 ${
                      index === 0 ? "rounded-t" : ""
                    } ${index === data.data.length - 1 ? "rounded-b" : ""}`}
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
