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
import { CHART_SYNCID } from "./Chart";
import { kFormatter } from "./helpers";

const ChartBalance = () => {
  const { state } = useAppContext();

  const { chart } = state;

  const allValues = chart.data.map((v) => parseFloat(v.balanceFIAT));
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
              <linearGradient
                id="colorBalanceCrypto"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalanceFIAT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="totalFIAT"
              stroke="#82ca9d"
              fillOpacity={0}
              name="Investment"
            />
            <Area
              type="monotone"
              dataKey="balanceFIAT"
              fill="url(#colorBalanceFIAT)"
              stroke="#82ca9d"
              fillOpacity={1}
              name="Balance in FIAT"
            />
            <Area
              type="monotone"
              dataKey="balanceCrypto"
              stroke="#F59E0B"
              fillOpacity={1}
              fill="url(#colorBalanceCrypto)"
              name="Balance in crypto"
            />
            <Area
              type="monotone"
              dataKey="percentageChange"
              stroke="#F59E0B"
              fillOpacity={0}
              name="ROI"
            />

            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
              type="number"
              domain={[minValue, maxValue]}
            />
            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

export default ChartBalance;
