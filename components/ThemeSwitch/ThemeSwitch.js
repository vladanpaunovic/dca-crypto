import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

const ThemeSwitch = ({ label }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="transition dark:text-white text-gray hover:text-gray-900 rounded-full focus:outline-none flex items-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {label && <span className="mr-1">{label}</span>}
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeSwitch;
