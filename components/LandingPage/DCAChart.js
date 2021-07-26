import useChartStrokeColor from "./useChartStrokeColor";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";

const chartData = [
  {
    price: 9662.71,
    averagePrice: 8610,
  },
  {
    price: 9185.17,
    averagePrice: 9136,
  },
  {
    price: 11093.61,
    averagePrice: 9152,
  },
  {
    price: 11519.12,
    averagePrice: 9638,
  },
  {
    price: 10765.3,
    averagePrice: 10014,
  },
  {
    price: 13655.19,
    averagePrice: 10139,
  },
  {
    price: 17138.03,
    averagePrice: 10141,
  },
  {
    price: 26476.13,
    averagePrice: 11453,
  },
  {
    price: 32375.32,
    averagePrice: 13122,
  },
  {
    price: 49849.38,
    averagePrice: 15048,
  },
  {
    price: 55033.1,
    averagePrice: 18211,
  },
  {
    price: 48981.44,
    averagePrice: 21280,
  },
];

const DCAChart = () => {
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
            dataKey="averagePrice"
            stroke={primary}
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Average price (DCA)"
          />

          <Tooltip
            content={<CustomTooltip title="Actual price Vs. Average price" />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DCAChart;
