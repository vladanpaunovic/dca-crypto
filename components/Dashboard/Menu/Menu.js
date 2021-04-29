import { signOut } from "next-auth/client";
import {
  TemplateIcon,
  SwitchHorizontalIcon,
  UserIcon,
  MoonIcon,
  LogoutIcon,
  SunIcon,
} from "@heroicons/react/outline";
import Logo from "../../Logo/Logo";
import { useTheme } from "next-themes";

const Menu = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center">
          <div>
            <Logo />
          </div>
          <button
            className="transition dark:text-white text-gray ml-4 hover:text-gray-900 rounded-full p-1 mr-2 focus:outline-none"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <ul className="mt-16">
          <li className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-2 dark:text-gray-300">
            <a href="#" className="flex p-2">
              <TemplateIcon className="w-6 h-6 mr-2" /> Dashboard
            </a>
          </li>
          <li className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-2 dark:text-gray-300">
            <a href="#" className="flex p-2">
              <SwitchHorizontalIcon className="w-6 h-6 mr-2" /> My Exchanges
            </a>
          </li>
          <li className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-2 dark:text-gray-300">
            <a href="#" className="flex p-2">
              <UserIcon className="w-6 h-6 mr-2" /> My Account
            </a>
          </li>
        </ul>
      </div>
      <div>
        <button
          onClick={() => signOut()}
          className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 rounded mb-2 dark:text-gray-500 dark:hover:text-gray-200 flex w-full p-2"
        >
          <LogoutIcon className="w-6 h-6 mr-2" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Menu;
