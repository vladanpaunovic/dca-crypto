import dayjs from "dayjs";

import BreadcrumbDCA from "../../Breadcrumb/BreadcrumbDCA";
import { formatPrice } from "../../Currency/Currency";
// import CardCurrentCoin from "../CardCurrentCoin";

const CoinHeader = ({ currentCoin, input }) => {
  const coinSymbol = currentCoin.symbol.toUpperCase();

  const description = `Visualise and calculate historical returns of investing ${formatPrice(
    input.investment
  )} in ${currentCoin.coinSymbol} every ${
    input.investmentInterval
  } days from ${dayjs(input.dateFrom).format("MMM YYYY")} until now`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="px-4 md:px-0">
          <div className="flex items-center">
            <h1 className="text-gray-900 text-lg font-medium ">
              Dollar-cost averaging (DCA) calculator for{" "}
              <span className="text-indigo-700 capitalize">
                {currentCoin.name} ({coinSymbol})
              </span>{" "}
              backtesting
            </h1>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <BreadcrumbDCA name={currentCoin.name} coinId={currentCoin.id} />
      </div>
      <div className="col-span-1 p-4 md:p-0">{/* <CardCurrentCoin /> */}</div>
    </div>
  );
};

export default CoinHeader;
