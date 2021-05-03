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
import { kFormatter } from "../../Chart/helpers";

export const CHART_SYNCID = "main-chart";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const DashboardChart = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          syncId={CHART_SYNCID}
        >
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#F59E0B"
            fillOpacity={0}
            fill="url(#colorCoinPrice)"
            name="Price"
            dot={{ stroke: "#F59E0B" }}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(tick) => kFormatter(tick.toFixed(2))}
            dataKey="pv"
          />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
