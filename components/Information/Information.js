import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppContext } from "../Context/Context";
import Currency from "../Currency/Currency";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { Popover } from "@headlessui/react";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const InformationPopover = ({ description }) => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="ml-1">
            <InformationCircleIcon className="w-4 h-4 hover:text-indigo-900 dark:hover:text-yellow-500" />
          </Popover.Button>
          <Popover.Overlay
            className={`${
              open ? "opacity-30 fixed inset-0" : "opacity-0"
            } bg-black`}
          />
          <Popover.Panel className="relative">
            <div className="fixed inset-x-0 bottom-0 w-full border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow p-4 flex z-10 sm:absolute sm:w-80 sm:top-0 sm:h-52">
              {description}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

const Information = () => {
  const { state } = useAppContext();
  const currentCoin = state.currentCoin;

  const information = [
    {
      label: "Duration",
      value: `${dayjs.duration(state.input.duration, "days").humanize()} (${
        state.input.duration
      } days)`,
    },
    {
      label: "Total investment",
      value: (
        <>
          <Currency value={state.chart.insights.totalInvestment || 0} /> (
          {state.chart.data.length} investments)
        </>
      ),
    },
    {
      label: "Value in FIAT",
      value: <Currency value={state.chart.insights.totalValue?.fiat || 0} />,
    },
    {
      label: `Value in crypto`,
      value: (
        <>
          {state.chart.insights.totalValue?.crypto || 0}{" "}
          {currentCoin.symbol.toUpperCase()}
        </>
      ),
    },
    {
      label: "ROI",
      description: (
        <div>
          <p className="mb-2">ROI - Return of investment </p>
          <p className="text-thin text-sm">
            Return on investment, or ROI, is a mathematical formula that
            investors can use to evaluate their investments and judge how well a
            particular investment has performed compared to others.
          </p>
        </div>
      ),
      value: (
        <>
          <p>
            <span
              className={`inline-block px-2 text-sm text-white dark:text-gray-900 ${
                state.chart.insights.percentageChange > 0
                  ? "bg-green-400"
                  : "bg-red-400"
              } rounded`}
            >
              {state.chart.insights.percentageChange > 0 ? "+" : ""}
              {state.chart.insights.percentageChange}%
            </span>
          </p>
        </>
      ),
    },
  ];

  const allInformation = () => {
    const oddClass =
      "bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
    const evenClass =
      "bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
    return information.map((i, index) => (
      <div
        key={i.label}
        className={`${index % 2 === 0 ? evenClass : oddClass} ${
          index === information.length - 1 && "rounded-b-lg"
        }`}
      >
        <dt className="text-sm font-medium text-gray-500 dark:text-white flex">
          {i.label}{" "}
          {i.description && <InformationPopover description={i.description} />}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
          {i.value}
        </dd>
      </div>
    ));
  };

  return (
    <>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-white">
          Summarised data regarding your investment.
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-900">
        <dl>{allInformation()} </dl>
      </div>
    </>
  );
};

export default Information;
