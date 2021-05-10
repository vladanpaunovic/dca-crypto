import { useQuery } from "react-query";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "../../../server/apiClient";
import { kFormatter } from "../../Chart/helpers";
import { useDashboardContext } from "../../DashboardContext/DashboardContext";
import Loading from "../../Loading/Loading";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjs from "dayjs";
import { formatCurrency } from "@coingecko/cryptoformat";
import { useMemo } from "react";
import { useGetTickers } from "../../../queries/queries";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);

const mapFormatting = (entry, bot) => {
  switch (entry.dataKey) {
    case "orders.totalInvestment":
    case "orders.averageCost":
    case "price":
      return (
        <>
          {entry.name}: {formatCurrency(entry.value, bot.destination_currency)}
        </>
      );

    case "orders.totalBalance":
      const countOrders = entry.payload.orders?.countOrders;
      return (
        <>
          {entry.name}: {formatCurrency(entry.value, bot.destination_currency)}{" "}
          ({countOrders} {countOrders > 1 ? "orders" : "order"})
        </>
      );
    case "orders.totalHoldings":
      return (
        <>
          {entry.name}: {formatCurrency(entry.value, bot.origin_currency)}
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

const CustomTooltip = ({ active, payload, label }) => {
  const { state } = useDashboardContext();

  if (active && payload && payload.length && state.selectedBot) {
    return (
      <div className="p-4 transition-shadow border rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-200">{label}</p>
        {payload.map((e, index) => (
          <p
            key={`${e.value}-${index}`}
            style={{ color: e.color }}
            className="text-sm"
          >
            {mapFormatting(e, state.selectedBot)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export const CHART_SYNCID = "dashboard-chart";

const DashboardChart = () => {
  const { state } = useDashboardContext();

  const getTickers = useGetTickers();

  const memoizedValue = useMemo(() => {
    if (!getTickers.data) {
      return [];
    }

    const match = getTickers.data.reduce((prev, curr) => {
      const executedOrdersUntilNow = state.selectedBot.orders.filter((order) =>
        dayjs(order.createdAt).isSameOrBefore(curr.date, "day")
      );

      const orders = executedOrdersUntilNow.reduce((p, c) => {
        const totalInvestment =
          executedOrdersUntilNow.length *
          state.selectedBot.origin_currency_amount;

        const totalHoldings = p.amount ? p.amount + c.amount : c.amount;

        const totalBalance = totalHoldings * curr.price;

        const averageCost = c.averageCost;

        return {
          amount: p.amount ? p.amount + c.amount : c.amount,
          totalInvestment,
          totalHoldings,
          totalBalance,
          averageCost,
          countOrders: executedOrdersUntilNow.length,
        };
      }, []);

      const output = [
        ...prev,
        {
          ...curr,
          date: dayjs(curr.date).format("LLL"),
          orders,
        },
      ];

      return output;
    }, []);

    return match;
  }, [getTickers.data, state.selectedBot.orders]);

  if (getTickers.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading width={30} height={30} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={memoizedValue}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          syncId={CHART_SYNCID}
        >
          <defs>
            <linearGradient id="price" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="price"
            stroke="#F59E0B"
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#price)"
            name={`Price`}
          />
          <Area
            connectNulls
            type="monotone"
            stroke="#82ca9d"
            strokeWidth={2}
            dataKey="orders.averageCost"
            name={`Average cost`}
            fill="url(#colorCostAverage)"
          />
          <Area
            connectNulls
            stroke="#82ca9d"
            type="monotone"
            dataKey="orders.totalInvestment"
            name={`Total investment`}
            fill="url(#orderPrice)"
          />
          <Area
            connectNulls
            stroke="#82ca9d"
            type="monotone"
            dataKey="orders.totalBalance"
            name={`Balance ${state.selectedBot.destination_currency}`}
            fill="url(#orderPrice)"
          />
          <Area
            connectNulls
            stroke="#82ca9d"
            type="monotone"
            dataKey="orders.totalHoldings"
            name={`Balance ${state.selectedBot.origin_currency}`}
            fill="url(#orderPrice)"
          />
          {/* {memoizedValue.map((m) =>
            m.order ? (
              <ReferenceDot
                key={m.order.id}
                x={m.date}
                y={m.price}
                stroke="#82ca9d"
                r={4}
                fill="#82ca9d"
              />
            ) : null
          )} */}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
            dataKey="price"
          />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
