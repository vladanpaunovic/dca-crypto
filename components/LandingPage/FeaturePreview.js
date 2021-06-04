import { useTheme } from "next-themes";
import Image from "next/image";

const FeaturePreview = () => {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const imageUrl = isLight
    ? "/images/dashboard_preview_light.png"
    : "/images/dashboard_preview_dark.png";
  return (
    <div className="mt-20">
      <div className="container lg:px-6 max-w-7xl w-full mx-auto max-w-80">
        <p className="text-indigo-500 dark:text-yellow-500 font-semibold uppercase text-center mb-2">
          Designed for ordinary people
        </p>
        <h2 className="text-4xl mb-6 tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl text-center">
          Everything at glance. Easy.
        </h2>
        <p className="mt-3 text-base mb-10 text-center text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Buy different assets from different exchanges. Automate as many
          buyings as you wish.
        </p>
        <Image
          src={imageUrl}
          className="w-full h-full"
          alt="dca-cc dashboard preview"
          width="800"
          height="500"
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default FeaturePreview;
