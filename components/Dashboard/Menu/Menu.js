import { signOut } from "next-auth/client";
import {
  TemplateIcon,
  SwitchHorizontalIcon,
  UserIcon,
  MoonIcon,
  LogoutIcon,
  SunIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";
import Link from "next/link";

const Menu = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 h-screen flex flex-col justify-between bg-indigo-500 dark:bg-gray-600">
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="border rounded px-2 py-1 font-medium bg-gray-100 shadow dark:bg-gray-700 dark:border-gray-900">
            <span className="text-indigo-500 dark:text-yellow-500">DCA</span>CC
          </div>
        </div>
        <ul className="mt-16">
          <li className="hover:bg-indigo-400 dark:hover:bg-gray-700 rounded mb-2 text-gray-50 dark:text-gray-300">
            <Link href="/dashboard">
              <a className="text-xs flex p-2 flex-col justify-center items-center w-full">
                <TemplateIcon className="w-6 h-6 mb-2" /> Dashboard
              </a>
            </Link>
          </li>
          <li className="hover:bg-indigo-400 dark:hover:bg-gray-700 rounded mb-2 text-gray-50 dark:text-gray-300">
            <Link href="/my-exchanges">
              <a className="text-xs flex p-2  flex-col justify-center items-center w-full">
                <SwitchHorizontalIcon className="w-6 h-6 mb-2" /> Exchanges
              </a>
            </Link>
          </li>
          <li className="hover:bg-indigo-400 dark:hover:bg-gray-700 rounded mb-2 text-gray-50 dark:text-gray-300">
            <a
              href="#"
              className="text-xs flex p-2 flex-col justify-center items-center w-full"
            >
              <UserIcon className="h-6 mb-2" /> Account
            </a>
          </li>
        </ul>
      </div>
      <div>
        <button
          className="transition dark:text-white text-gray w-full hover:text-gray-900 rounded-full p-1 focus:outline-none flex justify-center items-center mb-2"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => signOut()}
          className="text-xs hover:bg-indigo-400 dark:hover:bg-gray-700 text-gray-300 hover:text-gray-900 rounded mb-2 dark:text-gray-500 dark:hover:text-gray-200 flex flex-col items-center w-full p-2"
        >
          <LogoutIcon className="w-6 h-6 mb-2" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Menu;
