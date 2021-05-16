import { signOut } from "next-auth/client";
import {
  TemplateIcon,
  SwitchHorizontalIcon,
  MoonIcon,
  LogoutIcon,
  SunIcon,
  XIcon,
  MenuIcon,
  CogIcon,
  CalculatorIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const DashboardMenu = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const isOnSamePage = (href) => router.pathname === href;

  return (
    <nav className="relative lg:h-screen dark:border-gray-800">
      <div className="w-full h-full">
        <div className="w-full pl-2 lg:pl-0 relative flex justify-between lg:justify-center items-center lg:w-auto h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-yellow-400 dark:to-yellow-500 text-gray-900 hover:to-indigo-500 dark:hover:from-yellow-500">
          <Link href="/dashboard">
            <a
              title="dashboard"
              className="flex items-center text-xs uppercase font-bold leading-snug text-white dark:text-gray-900 hover:opacity-75 p-1 rounded-full transform rotate-45"
            >
              <SwitchHorizontalIcon className="w-6 h-6" />
            </a>
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XIcon className="w-6 h-6 text-gray-200" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-200" />
            )}
          </button>
        </div>
        <div
          className={`lg:flex items-center justify-between flex-col lg:mt-4 ${
            menuOpen ? "" : "hidden"
          }`}
        >
          <ul className="flex flex-col list-none w-full divide-y lg:divide-none divide-gray-700">
            <li className="nav-item">
              <Link href="/dashboard">
                <a
                  title="Dashboard"
                  className={`px-3 py-4 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug hover:opacity-75 ${
                    isOnSamePage("/dashboard")
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-400"
                  }`}
                >
                  <TemplateIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">Dashboard</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dashboard/dca/bitcoin">
                <a
                  title="DCA calculator"
                  className={`px-3 py-4 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug dark:hover:opacity-75 ${
                    isOnSamePage("/dashboard/dca/[coin]")
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-400"
                  }`}
                >
                  <CalculatorIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">Dashboard</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings">
                <a
                  title="Settings"
                  className={`px-3 py-4 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug  hover:opacity-75 ${
                    isOnSamePage("/settings")
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-400"
                  }`}
                  href="#pablo"
                >
                  <CogIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">Settings</span>
                </a>
              </Link>
            </li>
            <li className="nav-item hidden lg:flex justify-center">
              <div className="bg-gray-600 w-2/3 rounded h-1"></div>
            </li>
            <li className="nav-item">
              <button
                title="Switch theme"
                className="focus:outline-none transition px-3 w-full py-4 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 mr-1" />
                ) : (
                  <SunIcon className="w-5 h-5 mr-1" />
                )}
                <span className="lg:hidden">Switch theme</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                title="Sign out"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="focus:outline-none text-xs px-3 w-full py-4 lg:py-2 flex items-center lg:justify-center uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75 "
              >
                <LogoutIcon className="w-6 h-6 mr-1" />
                <span className="lg:hidden">Sign out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardMenu;
