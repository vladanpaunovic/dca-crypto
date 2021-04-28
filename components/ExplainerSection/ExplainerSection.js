import SavingsIllustration from "../../Illustrations/SavingsIllustration";

const ExplainerSection = () => {
  return (
    <div className="flex flex-col sm:flex-row px-4 xl:px-0">
      <div className="sm:w-4/6">
        <h3 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-4xl">
          What is dollar cost averaging{" "}
          <span className="block text-indigo-600 dark:text-yellow-500 xl:inline">
            (DCA)
          </span>
          ?
        </h3>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Dollar cost averaging (DCA) is an investment strategy where a person
          invests a set amount of money over given time intervals, such as after
          every paycheck. Investors choose this investment strategy when long
          term growth of an asset is foreseen, but a removal of short term
          volatility is desired.
        </p>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Investors choose this investment strategy when long term growth of an
          asset is foreseen, but a removal of short term volatility is desired.(
          <a
            href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp"
            target="_blank"
            rel="nofollow"
            className="underline"
          >
            investopedia
          </a>
          )
        </p>
      </div>
      <div className="sm:w-2/6">
        <SavingsIllustration className="w-full fill-current text-indigo-500 dark:text-yellow-500" />
      </div>
    </div>
  );
};

export default ExplainerSection;
