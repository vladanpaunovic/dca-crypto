import { useQuery } from "react-query";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import apiClient from "../../../server/apiClient";
import { kFormatter } from "../../Chart/helpers";
import { useDashboardContext } from "../../DashboardContext/DashboardContext";
import Loading from "../../Loading/Loading";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
dayjs.extend(localizedFormat);

export const CHART_SYNCID = "dashboard-chart";

const DashboardChart = () => {
  const { state } = useDashboardContext();

  const refetchInterval = {
    minute: 60000,
    hour: 3600000,
    day: 84000000,
    week: 588000000,
  };

  const getTickers = useQuery({
    queryKey: state.selectedBot
      ? `get-tickers-${state.selectedBot.trading_pair}`
      : "get-tickers-init",
    queryFn: async () => {
      const credentials = state.selectedBot.exchange.api_requirements;
      const exchangeId = state.selectedBot.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/fetch-tickers`,
        {
          params: {
            credentials,
            symbol: state.selectedBot.trading_pair,
            since: state.selectedBot.createdAt,
            interval_type: state.selectedBot.interval_type,
          },
        }
      );

      return response.data;
    },
    enabled: !!state.selectedBot,
    refetchInterval: refetchInterval[state.selectedBot.interval_type],
  });

  if (!state.selectedBot) {
    return "Please, select bot to view performance";
  }

  if (getTickers.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading width={30} height={30} />
      </div>
    );
  }

  let tempOrdersList = [...state.selectedBot.orders];
  const match = getTickers.data
    .reduce((prev, curr) => {
      const executedOrderIndex = tempOrdersList.findIndex((order) => {
        if (order) {
          return dayjs(order.createdAt).isSame(
            curr.date,
            state.selectedBot.interval_type
          );
        }

        return false;
      });

      if (tempOrdersList[executedOrderIndex]) {
        const output = [
          ...prev,
          { ...curr, order: tempOrdersList[executedOrderIndex] },
        ];
        delete tempOrdersList[executedOrderIndex];
        return output;
      }

      return [...prev, curr];
    }, [])
    .map((day) => ({
      ...day,
      date: dayjs(day.date).format("LLL"),
      ...(day.order
        ? { totalHoldings: day.order.balanceInQuoteCurrency * day.price }
        : {}),
    }));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={match}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          // syncId={CHART_SYNCID}
        >
          <defs>
            <linearGradient id="price" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="orderPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="price"
            stroke="#F59E0B"
            fillOpacity={0}
            fill="url(#price)"
            name={`Price (${state.selectedBot.destination_currency})`}
          />

          {match.map((m) =>
            m.order ? (
              <ReferenceDot
                x={m.date}
                y={m.price}
                stroke="green"
                r={4}
                fill="green"
              />
            ) : null
          )}

          <Area
            connectNulls
            type="monotone"
            dataKey="order.averageCost"
            name={`Average cost (${state.selectedBot.destination_currency})`}
            fill="url(#orderPrice)"
          />

          <Area
            connectNulls
            type="monotone"
            dataKey="order.totalInvestment"
            name={`Total investment (${state.selectedBot.destination_currency})`}
            fill="url(#orderPrice)"
          />
          <Area
            connectNulls
            type="monotone"
            dataKey="totalHoldings"
            name={`Total holdings (${state.selectedBot.destination_currency})`}
            fill="url(#orderPrice)"
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
            dataKey="price"
          />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
