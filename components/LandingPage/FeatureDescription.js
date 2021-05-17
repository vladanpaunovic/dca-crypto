import {
  CalculatorIcon,
  ChartBarIcon,
  LightningBoltIcon,
  MailIcon,
  SwitchHorizontalIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";

const features = [
  {
    icon: (
      <SwitchHorizontalIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />
    ),
    title: "5 most trusted crypto exchanges",
    description:
      "Connect some or all of 5 most trusted crypto exchanges. Several more exchanges are in development and will integrate soon.",
  },
  {
    icon: (
      <LightningBoltIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />
    ),
    title: "As many trading bots as you need",
    description:
      "Experiment, play with different bots on different exchanges. Creating a new bot is easy and can be done in less then 1 minute.",
  },
  {
    icon: (
      <CalculatorIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />
    ),
    title: "Powerful insights with DCA calculator",
    description:
      "Dollar cost average calculator can help you estimate the impact of 100+ assets and help you choose the best one for your investments",
  },
  {
    icon: (
      <ChartBarIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />
    ),
    title: "Rich visualisations, giving the full picture",
    description:
      "Don't just read, visualise the impact your investment is making. Our charts are made simple, yet they contain powerful data, important to you.",
  },
  {
    icon: <MailIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />,
    title: "Email notifications",
    description:
      "We all hate them, yet nobody wants their bots to run idle. We send only the important ones and will notify you when there is a problem with your exchange or when one of your bots is running not running.",
  },
  {
    icon: (
      <ViewGridAddIcon className="h-6 w-6 text-indigo-500 dark:text-yellow-500" />
    ),
    title: "Seemless integration, quick setup",
    description:
      "Integrating new exchange takes less then 3 minutes (with accounted time for retriving the API keys). The idea is to keep it simple forever and bring more people in crypto.",
  },
];

const FeatureDescription = () => {
  return (
    <div className="mt-20">
      <div className="container mx-auto max-w-7xl px-6 p-6 bg-white dark:bg-gray-900 flex flex-col md:flex-row">
        <div className="mb-16 w-3/3 md:w-1/3 pl-4 md:pl-0 md:pr-8">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to dollar cost average
          </p>
        </div>
        <div className="grid grid-cols-2 w-3/3 md:w-2/3 gap-8 dark:text-white">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="w-full flex col-span-3 md:col-span-1"
            >
              <div className="flex">{feature.icon}</div>
              <div className="ml-4">
                <h3 className="text-xl">{feature.title}</h3>
                <p className="leading-loose text-gray-500 dark:text-gray-200 text-md">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDescription;
