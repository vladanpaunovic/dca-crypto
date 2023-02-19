import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import Link from "next/link";
import dayjs from "dayjs";
import * as ga from "../helpers/GoogleAnalytics";

const Footer = ({ availableTokens }) => {
  const tokens = availableTokens?.slice(0, 20);
  const dcaAllTokens = tokens?.map((coin) => (
    <li key={coin.id}>
      <Link
        href={`/dca/${coin.id}`}
        className="text-gray-600 hover:underline"
        onClick={() => {
          ga.event({
            action: "footer_link",
            params: { calculator: "dca", token: coin.name },
          });
        }}
      >
        <span className="text-gray-600 font-medium">DCA</span> {coin.name}
        <span className="sr-only">
          Dollar cost average {coin.name} calculator
        </span>
      </Link>
    </li>
  ));

  const first10Tokens = dcaAllTokens?.slice(0, 10);
  const second10Tokens = dcaAllTokens?.slice(10, 20);

  return (
    <footer className="m-8">
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl ">
        <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-4">
          <div className="md:max-w-md lg:col-span-1">
            <Link
              href="/"
              aria-label="Go home"
              title="Company"
              className="inline-flex items-center"
            >
              <SwitchHorizontalIcon className="w-8 transform rotate-45 text-indigo-500" />
              <span className="ml-2 text-xl font-bold tracking-wide text-indigo-500 uppercase">
                DCA-CC
              </span>
            </Link>
            <div className="mt-4 lg:max-w-sm">
              <p className="text-sm text-gray-800">
                Open-source calculator for Dollar Cost Averaging and lump sum
                investing in cryptocurrency.
              </p>
              <p className="mt-4 text-sm text-gray-800">
                DCA-CC helps you remove emotions from your investing by giving
                you tools for stressless investing.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 row-gap-8 lg:col-span-3 md:grid-cols-3">
            <div>
              <p className="font-semibold tracking-wide text-gray-800">
                DCA Calculator
              </p>
              <ul className="mt-2 space-y-2">{first10Tokens}</ul>
            </div>

            <div>
              <div className="font-semibold tracking-wide text-gray-800 sm:h-6" />
              <ul className="mt-2 space-y-2">{second10Tokens}</ul>
            </div>

            <div>
              <p className="font-semibold tracking-wide text-gray-800">
                DCA-CC
              </p>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link
                    href="/all-tokens"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    All tokens list calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/dca-last-9-years"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    DCA in the last 9 years
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/legal/terms-conditions"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy-policy"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookie-policy"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    Cookie policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com/dca_cc"
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                  >
                    DCA-CC on Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/vladanpaunovic/dca-crypto/issues/new?template=feature.yml"
                    rel="nofollow noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                    target="_blank"
                  >
                    Submit a feature request
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/vladanpaunovic/dca-crypto/issues/new?template=bug.yml"
                    rel="nofollow noreferrer"
                    className="text-gray-600 transition-colors duration-300 hover:underline"
                    target="_blank"
                  >
                    Report bug
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-5 pb-10 border-t sm:flex-row">
          <p className="text-sm text-gray-600">
            © Copyright {dayjs().format("YYYY")} DCA CC. All rights reserved.
          </p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              target="_blank"
              href="https://twitter.com/dca_cc"
              aria-label="DCA-CC on Twitter"
              rel="nofollow noreferrer"
              className="text-gray-500 hover:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
              </svg>
            </a>
            <a
              target="_blank"
              rel="nofollow noreferrer"
              aria-label="DCA-CC on GitHub"
              href="https://github.com/vladanpaunovic/dca-crypto"
              className="text-gray-500 hover:opacity-50"
            >
              <svg fill="currentColor" className="h-5" viewBox="0 0 16 16">
                <path
                  fill="currentColor"
                  d="M8 .2a8 8 0 00-2.53 15.59.4.4 0 00.53-.39v-1.36C3.78 14.53 3.31 13 3.31 13a2.12 2.12 0 00-.89-1.17c-.73-.5.05-.49.05-.49a1.68 1.68 0 011.23.82 1.7 1.7 0 002.3.64 1.71 1.71 0 01.51-1.07c-1.78-.2-3.64-.89-3.64-4a3.09 3.09 0 01.82-2.15 2.88 2.88 0 01.11-2.06s.67-.22 2.2.82a7.58 7.58 0 014 0c1.53-1 2.2-.82 2.2-.82a2.87 2.87 0 01.08 2.12 3.09 3.09 0 01.82 2.15c0 3.07-1.87 3.75-3.65 3.95a1.91 1.91 0 01.55 1.47v2.19a.4.4 0 00.55.38A8 8 0 008 .2z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
