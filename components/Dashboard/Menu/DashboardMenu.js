import { signOut } from "next-auth/client";
import {
  TemplateIcon,
  SwitchHorizontalIcon,
  MoonIcon,
  LogoutIcon,
  SunIcon,
  XIcon,
  MenuIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

const DashboardMenu = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative lg:h-screen dark:border-gray-800">
      <div className="w-full h-full">
        <div className="w-full pl-2 lg:pl-0 relative flex justify-between lg:justify-center items-center lg:w-auto h-16 bg-gray-900 lg:bg-indigo-500">
          <Link href="/dashboard">
            <a
              title="dashboard"
              className="flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 p-1 rounded-full transform rotate-45"
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
                  className="px-3 py-4 lg:py-2 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75"
                >
                  <TemplateIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">Dashboard</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/my-exchanges">
                <a
                  title="Exchanges"
                  className="px-3 py-4 lg:py-2 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75"
                  href="#pablo"
                >
                  <SwitchHorizontalIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">Exchanges</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/account">
                <a
                  title="Exchanges"
                  className="px-3 py-4 lg:py-2 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75"
                  href="#pablo"
                >
                  <UserIcon className="w-6 h-6 mr-1" />
                  <span className="lg:hidden">My account</span>
                </a>
              </Link>
            </li>
            <li className="nav-item hidden lg:flex justify-center py-2">
              <div className="bg-gray-600 w-2/3 rounded h-1"></div>
            </li>
            <li className="nav-item">
              <button
                title="Switch theme"
                className="transition px-3 w-full py-4 lg:py-2 flex items-center lg:justify-center text-xs uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75"
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
                className="text-xs px-3 w-full py-4 lg:py-2 flex items-center lg:justify-center uppercase font-bold leading-snug text-gray-400 dark:text-gray-400 hover:opacity-75 "
              >
                <LogoutIcon className="w-6 h-6 mr-1" />
                <span className="lg:hidden">Dashboard</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardMenu;
