import Head from "next/head";
import {
  AppContextProvider,
  useAppContext,
} from "../../components/Context/Context";
import Information from "../../components/Information/Information";
import { getAllCoins } from "../../queries/queries";
import { CACHE_INVALIDATION_INTERVAL, defaultCurrency } from "../../config";
import { TweetMessage } from "../../components/TweetMessage/TweetMessage";
import axios from "axios";
import React from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { kFormatter } from "../../components/Chart/helpers";
import useChartLegend from "../../components/Chart/useChartLegend";
import { formatCurrency } from "@coingecko/cryptoformat";
import { useTheme } from "next-themes";

const mapFormatting = (entry, currentCoin, currency) => {
  switch (entry.dataKey) {
    case "coinPrice":
    case "costAverage":
      return (
        <>
          {entry.name}: {formatCurrency(entry.value, currency)}
        </>
      );

    case "totalFIAT":
    case "balanceFIAT":
      return (
        <>
          {entry.name}: {formatCurrency(parseFloat(entry.value), currency)}
        </>
      );
    case "balanceCrypto":
      return (
        <>
          {entry.name}: {formatCurrency(entry.value, currentCoin.symbol)}
        </>
      );
    default:
      return (
        <>
          {entry.name}: {entry.value}
        </>
      );
  }
};

const CustomTooltip = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const dateLabel = dayjs(label).format("LLL");
    return (
      <div className="p-4 transition-shadow border rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-200">{dateLabel}</p>
        {payload.map((e, index) => (
          <p
            key={`${e.value}-${index}`}
            style={{ color: e.color }}
            className="text-sm"
          >
            {mapFormatting(e, props.currentCoin, props.currency)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export async function getServerSideProps(context) {
  const {
    coin,
    investment,
    investmentInterval,
    dateFrom,
    dateTo,
    currency,
  } = context.query;

  const availableTokens = await getAllCoins(currency || defaultCurrency);

  const payload = {
    coinId: coin,
    investmentInterval,
    investment,
    dateFrom,
    dateTo,
    currency: currency || defaultCurrency,
  };

  let dcaData;
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/calculate-dca`,
      payload
    );
    dcaData = response.data;
  } catch (error) {
    console.log(error);
  }

  context.res.setHeader(
    "Cache-Control",
    `s-maxage=${CACHE_INVALIDATION_INTERVAL}, stale-while-revalidate`
  );

  return {
    props: {
      availableTokens,
      dcaData: dcaData || null,
      coinId: coin || null,
      investment: investment || null,
      investmentInterval: investmentInterval || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      currency,
    },
  };
}

const CoinWrapper = (props) => {
  const currentCoin = props.availableTokens.find(
    (token) => token.id === props.coinId
  );

  if (!currentCoin) {
    throw new Error("Coin ID not found.");
  }

  return <Coin {...props} currentCoin={currentCoin} />;
};

const Chart = (props) => {
  const { strokeSize, handleMouseEnter, handleMouseLeave } = useChartLegend(
    "coinPrice",
    "costAverage"
  );
  const { theme } = useTheme();
  const isLight = theme === "light";
  const color = isLight ? "#4B5563" : "#F3F4F6";

  const allValues = props.dcaData.chartData.map((v) => parseFloat(v.coinPrice));
  const minValue = Math.min(...allValues) / 1.1;
  const maxValue = Math.max(...allValues) * 1.1;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={props.dcaData.chartData}>
          <defs>
            <linearGradient id="colorCoinPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCostAverage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="coinPrice"
            stroke="#F59E0B"
            fillOpacity={0}
            strokeWidth={strokeSize.coinPrice}
            fill="url(#colorCoinPrice)"
            name="Price"
            dot={{ stroke: "#F59E0B", strokeWidth: strokeSize.coinPrice }}
          />
          <Area
            type="monotone"
            dataKey="costAverage"
            stroke="#82ca9d"
            strokeWidth={strokeSize.costAverage}
            fillOpacity={0}
            fill="url(#colorCostAverage)"
            name="Average cost"
          />

          <Area
            type="monotone"
            dataKey="totalFIAT"
            stroke={color}
            fillOpacity={0}
            name="Investment"
          />
          <Area
            type="monotone"
            dataKey="balanceFIAT"
            fill="url(#colorBalanceFIAT)"
            stroke={color}
            fillOpacity={1}
            name="Balance"
          />
          <Area
            type="monotone"
            dataKey="balanceCrypto"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorBalanceCrypto)"
            name={`Balance`}
          />

          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
            dataKey="coinPrice"
            type="number"
            domain={[minValue, maxValue]}
          />
          <Tooltip content={<CustomTooltip {...props} />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const Coin = (props) => {
  const coinSymbol = props.currentCoin.symbol.toUpperCase();

  return (
    <div className="w-full">
      <Head>
        <title>
          DCA Crypto - Dollar cost average {props.currentCoin.name} (
          {coinSymbol}) calculator
        </title>
        <meta
          name="description"
          content={`Dollar cost average calculator for ${props.currentCoin.name} (${coinSymbol}). Visualise and examine the impact of your investments in ${props.currentCoin.name} or any other popular crypto.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="">
          <div className="h-96 w-full">
            <Chart {...props} />
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-400 text-center">
              Data provided by{" "}
              <a
                href="https://www.dca-cc.com"
                target="_blank"
                className="underline text-blue-500"
              >
                DCA-CC
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoinWrapper;
