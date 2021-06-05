import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import Link from "next/link";
import dayjs from "dayjs";
import { useSession } from "next-auth/client";

const Footer = ({ availableTokens }) => {
  const [session] = useSession();
  console.log(availableTokens);

  const allTokens = availableTokens.map((coin) => (
    <li>
      <Link href={`/dca/${coin.id}`}>
        <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 overflow-ellipsis truncate hover:underline">
          DCA {coin.name}
          <span className="sr-only">Dollar cost average {coin.name}</span>
        </a>
      </Link>
    </li>
  ));

  return (
    <footer className="m-8">
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl ">
        <div className="mb-16">
          <div>
            <h2 className="font-semibold tracking-wide text-gray-800 dark:text-gray-300 mb-4">
              Try dollar cost average calculator for many coins
            </h2>
            <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {allTokens}
            </ul>
          </div>
        </div>

        <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-4">
          <div className="md:max-w-md lg:col-span-1">
            <Link href="/">
              <a
                aria-label="Go home"
                title="Company"
                className="inline-flex items-center"
              >
                <SwitchHorizontalIcon className="w-8 transform rotate-45 text-indigo-500 dark:text-yellow-500" />
                <span className="ml-2 text-xl font-bold tracking-wide text-indigo-500 dark:text-yellow-500 uppercase">
                  DCA-CC
                </span>
              </a>
            </Link>
            <div className="mt-4 lg:max-w-sm">
              <p className="text-sm text-gray-800 dark:text-gray-400">
                Dollar Cost Averaging Cryptocurrency.
              </p>
              <p className="mt-4 text-sm text-gray-800 dark:text-gray-400">
                One place help you remove emotions from your investing by giving
                you tools for stressless investing.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 row-gap-8 lg:col-span-3 md:grid-cols-3">
            <div>
              <p className="font-semibold tracking-wide text-gray-800 dark:text-gray-300">
                Popular
              </p>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/all-tokens">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      All tokens list calculator
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/dca/bitcoin">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Bitcoin DCA calculator
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/dca/ethereum">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Ethereum DCA calculator
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/dca/cardano">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Cardano DCA calculator
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold tracking-wide text-gray-800 dark:text-gray-300">
                DCA-CC
              </p>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/legal/terms-conditions">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Terms & Conditions
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy-policy">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Privacy policy
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookie-policy">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Cookie policy
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com/dca_cc">
                    <a
                      target="_blank"
                      className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      DCA-CC on Twitter
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us">
                    <a className="text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400">
                      Contact us
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="rounded-md shadow">
                {session ? (
                  <Link href="/dashboard">
                    <a className="w-full py-4 px-4 bg-indigo-500 dark:bg-yellow-500 focus:ring-offset-indigo-200 text-white dark:text-gray-900 flex justify-center transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                      Go to dashboard
                    </a>
                  </Link>
                ) : (
                  <Link href="/register">
                    <a className="w-full py-4 px-4 bg-indigo-500 dark:bg-yellow-500 focus:ring-offset-indigo-200 text-white dark:text-gray-900 flex justify-center transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                      Get Access
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-5 pb-10 border-t dark:border-gray-700 sm:flex-row">
          <p className="text-sm text-gray-600">
            © Copyright {dayjs().format("YYYY")} DCA CC. All rights reserved.
          </p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              target="_blank"
              href="https://twitter.com/dca_cc"
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
