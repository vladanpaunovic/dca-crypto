import ReactLoading from "react-loading";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Loading = ({ withWrapper, height, width }) => {
  const { theme } = useTheme();
  const [color, setColor] = useState();

  useEffect(() => {
    const isDark = theme === "dark";
    setColor(isDark ? "white" : "black");
  }, []);

  if (withWrapper) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ReactLoading type="bars" color={color} width={width} height={height} />
      </div>
    );
  }

  return (
    <ReactLoading type="bars" color={color} width={width} height={height} />
  );
};

export default Loading;