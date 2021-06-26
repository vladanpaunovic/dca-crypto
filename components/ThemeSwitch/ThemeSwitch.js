import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="transition dark:text-white text-gray hover:text-gray-900 rounded-full focus:outline-none"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeSwitch;
