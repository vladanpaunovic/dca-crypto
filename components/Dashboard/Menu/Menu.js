import { signOut } from "next-auth/client";
import {
  TemplateIcon,
  SwitchHorizontalIcon,
  MoonIcon,
  LogoutIcon,
  SunIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import Link from "next/link";
import Logo from "../../Logo/Logo";
import { useState } from "react";

const Menu = () => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-indigo-500 dark:bg-gray-800 border-b dark:border-gray-800">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Logo />
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block relative w-6 h-px rounded-sm bg-white"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div
          className={`lg:flex flex-grow items-center ${
            menuOpen ? "" : "hidden"
          }`}
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none ml-auto mt-5 lg:mt-0">
            <li className="nav-item">
              <Link href="/dashboard">
                <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                  <TemplateIcon className="w-6 h-6 mr-1" /> Dashboard
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/my-exchanges">
                <a
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <SwitchHorizontalIcon className="w-6 h-6 mr-1" /> Exchanges
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="transition px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => signOut()}
                className="text-xs px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75 "
              >
                <LogoutIcon className="w-6 h-6 mr-1" /> Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
