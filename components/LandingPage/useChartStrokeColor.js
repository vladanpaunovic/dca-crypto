import { useTheme } from "next-themes";

const useChartStrokeColor = () => {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return {
    price: isLight ? "#F59E0B" : "#9CA3AF",
    primary: isLight ? "#34D399" : "#34D399",
    secundary: isLight ? "#BE185D" : "#BE185D",
  };
};

export default useChartStrokeColor;
