import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

const ThemeSwitch = ({ label }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="transition text-gray hover:text-gray-900 rounded-full focus:outline-none flex items-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Change theme"
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
