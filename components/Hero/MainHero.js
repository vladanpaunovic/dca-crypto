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

  return (
    <>
      <div className="relative primary-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto lg:h-screen">
          <div className="relative z-10 h-full lg:pb-16">
            <div className="relative pt-6 pl-4 ">
              <div className="relative py-3 flex justify-center">
                <nav
                  className="relative max-w-7xl w-full flex items-center justify-between sm:h-10"
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
                        onClick={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      >
                        {theme === "light" ? (
                          <MoonIcon className="w-5 h-5" />
                        ) : (
                          <SunIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {!session ? (
                      <Link href="/auth/signin">
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
            </div>

            <main className="flex justify-center items-center h-full mx-auto max-w-7xl sm:px-6 px-4 py-20 mt-6 ">
              <div className="pb-20">
                <h1 className="text-4xl text-center tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-7xl">
                  Remove emotions <br />
                  <span className="block text-white dark:text-gray-900 xl:inline">
                    Automate investments
                  </span>
                </h1>
                <p className="mt-3 text-base text-center text-gray-200 dark:text-gray-700 sm:mt-5 sm:text-lg md:text-xl lg:mx-0">
                  Dollar cost averaging bots, designed to fit everyone, not
                  professional traders only.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
