import ReactLoading from "react-loading";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Loading = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState();

  useEffect(() => {
    const isDark = theme === "dark";
    setColor(isDark ? "white" : "black");
  }, []);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ReactLoading type="bars" color={color} />
    </div>
  );
};

export default Loading;
