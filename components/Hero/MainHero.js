/* This example requires Tailwind CSS v2.0+ */
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import Logo from "../Logo/Logo";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppContext } from "../Context/Context";
import { formatPrice } from "../Currency/Currency";
import { useSession } from "next-auth/client";

export default function Hero() {
  const [session] = useSession();
  const { theme, setTheme } = useTheme();
  const { state } = useAppContext();

  const stablecoins = ["tether", "usd-coin"];
  const topTokens = state.settings.availableTokens
    .filter((t) => !stablecoins.includes(t.id))
    .slice(0, 10);

  // Show different token every day
  const randomToken = topTokens[new Date().getDay()];

  return (
    <>
      <div className="relative py-3 flex justify-center">
        <nav
          className="relative max-w-7xl px-4 lg:px-6 w-full flex items-center justify-between sm:h-10"
          aria-label="Global"
        >
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center  md:w-auto">
              <Logo />
            </div>
          </div>
          <div className="flex items-center justify-end mr-4">
            <div className="mr-2">
              <button
                className="ml-2 dark:text-white text-gray hover:text-gray-900 rounded-full p-1 mr-2 focus:outline-none"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {!session ? (
              <Link href="/auth/signin?callbackUrl=/dashboard">
                <a className="px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:text-yellow-500 rounded font-medium">
                  Sign in
                </a>
              </Link>
            ) : (
              <Link href="/dashboard">
                <a className="px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:text-yellow-500 rounded font-medium">
                  Dashboard
                </a>
              </Link>
            )}
          </div>
        </nav>
      </div>
      <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 lg:max-w-5xl lg:w-full lg:pb-28 sm:pb-16 md:pb-20">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-900  transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 pl-4"></div>

            <main className="mt-10 mx-auto max-w-7xl sm:px-6 px-4 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">
                    Dollar-cost averaging calculator for
                  </span>{" "}
                  <span className="block text-indigo-600 dark:text-yellow-500 xl:inline">
                    Crypto
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Calculate, visualise and understand the potential of investing
                  in cryptocurencies. People saving $50 in Bitcoin per week,
                  over the last three years turned {formatPrice(8100)} into{" "}
                  {formatPrice(56087)}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href={`/dca/${randomToken.id}`}>
                      <a className="w-full flex items-center justify-center px-8 py-3 border dark:bg-yellow-500 dark:text-gray-900 border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        DCA {randomToken.name}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute pattern-domino lg:inset-y-0 lg:right-0 lg:w-1/3"></div>
      </div>
    </>
  );
}
