import { memo } from "react";
import dynamic from "next/dynamic";
import Loading from "../Loading/Loading";

const DynamicLumpSumChartTiming = dynamic(
  () => import("./LumpSumChartTiming"),
  {
    ssr: false,
    loading: () => <Loading withWrapper />,
  }
);

const DynamicLumpSumChart = dynamic(() => import("./LumpSumChart"), {
  ssr: false,
  loading: () => <Loading withWrapper />,
});

const WhatIsLumpSum = () => {
  return (
    <div className="">
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row ">
        <div className="w-4/4 md:w-2/4">
          <DynamicLumpSumChart />
        </div>
        <div className="w-4/4 md:w-2/4 pl-4 md:pl-0 md:ml-8">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            Lump sum investing
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight  sm:text-4xl">
            What is Lump Sum?
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Lump sum investing is an amount invested all at once, as opesed to
            dollar cost averaging where investment is devided across time
            intervals.
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            People choose this investment strategy when long term growth of an
            asset is foreseen (
            <a
              href="https://www.investopedia.com/terms/l/lump-sum-payment.asp"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              investopedia
            </a>
            ).
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row ">
        <div className="w-4/4 md:w-2/4 pl-4 md:pl-0">
          <h2 className="text-base text-indigo-500 dark:text-yellow-500 font-semibold tracking-wide uppercase">
            Timing
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight  sm:text-4xl">
            When should I start?
          </p>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Lump sum investing is one of the simplest investment strategies and
            finding the best time to start might be tricky. We suggest invisting
            in market during corrections or when a long term growth is
            inevitable.
          </p>
        </div>
        <div className="w-4/4 md:w-2/4 gap-8 dark:text-white  md:pr-8">
          <DynamicLumpSumChartTiming />
        </div>
      </div>
    </div>
  );
};

export default memo(WhatIsLumpSum);
