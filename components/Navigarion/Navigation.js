import Logo from "../Logo/Logo";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, TemplateIcon } from "@heroicons/react/outline";
import Link from "next/link";

const Navigation = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="text-indigo-700 body-font shadow w-full bg-white dark:bg-gray-900 px-4 py-2 sm:px-4">
      <div className="mx-auto flex flex-wrap justify-between flex-row items-center ">
        <Logo />

        <div className="inline-flex lg:justify-end ml-5 lg:ml-0 items-center">
          <button
            className="transition dark:text-white text-gray hover:text-gray-900 rounded-full p-1 mr-2 focus:outline-none"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>

          <Link href="/auth/signin">
            <a className="px-2 py-1 font-medium text-gray-900 dark:text-gray-200">
              Sign in
            </a>
          </Link>
          <Link href="/register">
            <a className="hidden sm:block px-3 py-2 ml-4 bg-gray-100 dark:bg-yellow-500 text-indigo-700 dark:text-gray-900 rounded font-medium shadow-lg transition hover:shadow-xl">
              Start DCA for free
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
