import useChartStrokeColor from "./useChartStrokeColor";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";

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

const LumpSumChart = () => {
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

export default LumpSumChart;
