import DonationModal from "../DonationModal/DonationModal";
import Logo from "../Logo/Logo";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

const Navigation = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="text-indigo-700 body-font shadow w-full bg-white dark:bg-gray-900 px-4 py-6 sm:px-8">
      <div className="mx-auto flex flex-wrap justify-between flex-row items-center ">
        <Logo />

        <div className="inline-flex lg:justify-end ml-5 lg:ml-0 ">
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
          <DonationModal />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
