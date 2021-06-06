import { useAppContext } from "../Context/Context";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { formatPrice } from "../Currency/Currency";
import { useCurrentCoin } from "../Context/mainReducer";
import { WEBSITE_URL } from "../../config";
import { useRouter } from "next/router";
import queryString from "querystring";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const TweetMessage = () => {
  const router = useRouter();
  const { state } = useAppContext();
  const currentCoin = useCurrentCoin();
  const coinSymbol = currentCoin.symbol.toUpperCase();
  const costAverage =
    state.chart.data[state.chart.data.length - 1]?.costAverage;

  const earnings = state.chart.insights.totalValue?.fiat || 0;
  const currency = state.settings.currency;

  const { coin, ...queryWithoutCoin } = router.query;
  const readyQueryString = queryString.stringify(queryWithoutCoin);
  const locationHref = `${WEBSITE_URL}/dca/${router.query.coin}/${readyQueryString}`;

  const priceChartMessage = `Investing ${formatPrice(
    state.input.investment || 0,
    currency
  )} in ${coinSymbol} from ${dayjs(state.input.dateFrom).format(
    "MMM YYYY"
  )} to ${dayjs(state.input.dateTo).format("MMM YYYY")} every ${
    state.input.investmentInterval
  } days (${formatPrice(
    state.chart.insights.totalInvestment || 0,
    currency
  )} in total) would result in ${formatPrice(earnings, currency)} of ${
    earnings > 0 ? "value" : "loss"
  }!\rAverage price of ${formatPrice(
    costAverage,
    currency
  )} per 1${coinSymbol}.\r${
    state.chart.insights.percentageChange > 0
      ? `+${state.chart.insights.percentageChange}%!`
      : state.chart.insights.percentageChange
  }`;

  return (
    <div>
      <p className="mt-1 text-sm text-gray-500 dark:text-white">
        {priceChartMessage}
      </p>
      <div className="flex justify-end mt-2">
        <a
          target="_blank"
          rel="canonical"
          data-size="large"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            priceChartMessage
          )}&url=${encodeURIComponent(locationHref)}&hashtags=${coinSymbol},${
            currentCoin.name
          }`}
          className="flex items-center justify-between transition rounded bg-white hover:bg-indigo-50 dark:bg-gray-900 dark:hover:bg-gray-800 py-1 px-2 text-indigo-700 dark:text-yellow-500 font-medium border shadow border-transparent"
        >
          Tweet
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};
