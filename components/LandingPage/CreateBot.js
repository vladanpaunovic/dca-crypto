import Image from "next/image";
import {
  CalculatorIcon,
  ChartPieIcon,
  CubeTransparentIcon,
} from "@heroicons/react/outline";
import { useTheme } from "next-themes";

const features = [
  {
    icon: (
      <CubeTransparentIcon className="h-6 w-6 text-white dark:text-gray-900" />
    ),
    title: "Transparent asset price",
    description:
      "Every time you start creating a new bot, you will be presented with the price of that moment from the selected exchange. This can help you inform about and avoid price fluctuations across different exchanges.",
  },
  {
    icon: <CalculatorIcon className="h-6 w-6 text-white dark:text-gray-900" />,
    title: "Minimum investment",
    description:
      "All exchanges have a miniumm investment threshold which is different for every asset they offer, and it's hard to track. This is why your bots are checking it for you and will inform you about the current minimum price.",
  },
  {
    icon: <ChartPieIcon className="h-6 w-6 text-white dark:text-gray-900" />,
    title: "Your balance on the exchange",
    description:
      "Sometimes, it's hard to track balance on all exchanges and remember it all. DCA bot you will receive the current balance of your investment currency from the selected exchange so you can make better investment decisions.",
  },
];

const CreateBot = () => {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const imageUrl = isLight
    ? "/images/create_bot_preview_light.png"
    : "/images/create_bot_preview_dark.png";
  return (
    <div className="mt-20">
      <div className="container mx-auto max-w-7xl px-6 p-6 bg-white dark:bg-gray-900 flex flex-col md:flex-row">
        <div className="mb-16 w-3/3 md:w-2/3 pl-4 md:pl-0 md:pr-8">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            What is bot?
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Your automated crypto buyer
          </p>
          <p className="leading-loose text-gray-500 dark:text-gray-200 text-md">
            Think of bots like your workers, doing all the work for you.
            Creating a bot takes less then a minute and is designed so everyone
            can do it.
          </p>

          <div className="mt-20">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="w-full flex col-span-3 md:col-span-1 mb-10"
              >
                <div className="flex">
                  <div>
                    <span className="flex bg-indigo-500 dark:bg-yellow-500 p-3 rounded-lg">
                      {feature.icon}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="leading-loose text-gray-500 dark:text-gray-200 text-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-3/3 md:w-1/3">
          <div className="rounded-xl border dark:border-gray-700 h-auto w-auto shadow-2xl">
            <Image
              src={imageUrl}
              className="rounded-xl"
              width="384"
              height="620"
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBot;
