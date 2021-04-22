import { useAppContext } from "../Context/Context";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

export const CHART_SYNCID = "main-chart";

const Chart = () => {
  const { state } = useAppContext();

  const { chart } = state;

  const allValues = chart.data.map((v) => parseInt(v.coinPrice));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues) * 1.06;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {chart.data.length ? (
        <ResponsiveContainer>
          <AreaChart
            data={chart.data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            syncId={CHART_SYNCID}
          >
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
              strokeWidth={3}
              fill="url(#colorCoinPrice)"
              name="Price"
              dot={{ stroke: "#F59E0B", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="costAverage"
              stroke="#82ca9d"
              strokeWidth={3}
              fillOpacity={0}
              fill="url(#colorCostAverage)"
              name="Average cost"
            />

            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis type="number" domain={[minValue, maxValue]} />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

export default Chart;
