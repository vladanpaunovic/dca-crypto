import Link from "next/link";
import { formatCurrency } from "@coingecko/cryptoformat";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { memo } from "react";

const useChartStrokeColor = () => {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return {
    price: isLight ? "#F59E0B" : "#9CA3AF",
    primary: isLight ? "#34D399" : "#34D399",
    secundary: isLight ? "#BE185D" : "#BE185D",
  };
};

const chartData = [
  {
    price: 9662.71,
    priceByYou: 9662.71,
  },
  {
    price: 9185.17,
    priceByYou: 9662.71,
  },
  {
    price: 11093.61,
    priceByYou: 9662.71,
  },
  {
    price: 11519.12,
    priceByYou: 9662.71,
  },
  {
    price: 10765.3,
    priceByYou: 9662.71,
  },
  {
    price: 13655.19,
    priceByYou: 9662.71,
  },
  {
    price: 17138.03,
    priceByYou: 9662.71,
  },
  {
    price: 26476.13,
    priceByYou: 9662.71,
  },
  {
    price: 32375.32,
    priceByYou: 9662.71,
  },
  {
    price: 49849.38,
    priceByYou: 9662.71,
  },
  {
    price: 55033.1,
    priceByYou: 9662.71,
  },
  {
    price: 48981.44,
    priceByYou: 9662.71,
  },
];

const CustomTooltip = ({ active, payload, title }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 transition-shadow border rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-200 font-semibold mb-2">
          {title}
        </p>
        {payload.map((e, index) => (
          <p
            key={`${e.payload.assetPrice}-${index}`}
            style={{ color: e.color }}
            className="text-sm"
          >
            {e.name}: <span>{formatCurrency(e.value, "USD")}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ChartDCA = () => {
  const { price, primary } = useChartStrokeColor();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Area
            type="monotone"
            dataKey="price"
            stroke={price}
            fillOpacity={0}
            strokeWidth={2}
            dot={{ width: 4 }}
            name="Actual sset price"
          />
          <Area
            type="monotone"
            dataKey="priceByYou"
            stroke={primary}
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Price you paid (Lump sum)"
          />

          <Tooltip
            content={
              <CustomTooltip title="Actual price Vs. Lump sum investing" />
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const dcaTiming = [
  {
    assetPrice: 7195.15,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 9509.81,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 8552.99,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 6403.14,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 8744.43,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 9427.12,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 9149.72,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 10904.92,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 11300.4,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 10743.19,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 13060.79,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 18753.29,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 24671.11,
    earlyBuyAverage: 7195.15,
    lateBuyAverage: 9149.72,
  },
];

const ChartTiming = () => {
  const { price, primary, secundary } = useChartStrokeColor();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={dcaTiming}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Area
            type="monotone"
            dataKey="assetPrice"
            stroke={price}
            fillOpacity={0}
            strokeWidth={2}
            dot={{ width: 4 }}
            name="Asset price"
          />
          <Area
            type="monotone"
            dataKey="earlyBuyAverage"
            stroke={primary}
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Early buy lump sum price"
          />
          <Area
            type="monotone"
            dataKey="lateBuyAverage"
            stroke={secundary}
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Late buy lump sum price"
          />

          <Tooltip
            content={<CustomTooltip title="Early Vs. Late investing" />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const WhatIsLumpSum = () => {
  return (
    <div className="">
      <div className="container mx-auto max-w-7xl px-6 p-6 flex flex-col md:flex-row ">
        <div className="w-4/4 md:w-2/4">
          <ChartDCA />
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
          <p className="mt-3 text-sm text-gray-400">
            Source: investing in Bitcoin from{" "}
            <Link href="/lump-sum/bitcoin?investment=5000&dateFrom=2021-01-01&currency=usd">
              <a target="_blank" className="underline">
                January 2021
              </a>
            </Link>
            .
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

          <p className="mt-3 text-sm text-gray-400">
            Source: investing in Bitcoin{" "}
            <Link href="/lump-sum/bitcoin?investment=5000&dateFrom=2020-01-01&currency=usd">
              <a target="_blank" className="underline">
                whole 2020
              </a>
            </Link>{" "}
            Vs. only the{" "}
            <Link href="/lump-sum/bitcoin?investment=5000&dateFrom=2020-07-01&currency=usd">
              <a target="_blank" className="underline">
                second half
              </a>
            </Link>{" "}
            of 2020
          </p>
        </div>
        <div className="w-4/4 md:w-2/4 gap-8 dark:text-white  md:pr-8">
          <ChartTiming />
        </div>
      </div>
    </div>
  );
};

export default memo(WhatIsLumpSum);
