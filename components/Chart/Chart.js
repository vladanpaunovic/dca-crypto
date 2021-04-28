import { useAppContext } from "../Context/Context";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Legend,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import useChartLegend from "./useChartLegend";
import { kFormatter } from "./helpers";
import Loading from "../Loading/Loading";

export const CHART_SYNCID = "main-chart";

const Chart = () => {
  const { state } = useAppContext();
  const { strokeSize, handleMouseEnter, handleMouseLeave } = useChartLegend(
    "coinPrice",
    "costAverage"
  );

  const { chart } = state;

  const allValues = chart.data.map((v) => parseFloat(v.coinPrice));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {chart.data.length && !state.input.isLoading ? (
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

            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
              dataKey="coinPrice"
              domain={[minValue, maxValue]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <Loading withWrapper />
      )}
    </div>
  );
};

export default Chart;
