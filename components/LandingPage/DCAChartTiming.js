import useChartStrokeColor from "./useChartStrokeColor";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";

const dcaTiming = [
  {
    assetPrice: 7195.15,
    earlyBuyAverage: 7195.15,
  },
  {
    assetPrice: 9509.81,
    earlyBuyAverage: 8352.48,
  },
  {
    assetPrice: 8552.99,
    earlyBuyAverage: 8419.32,
  },
  {
    assetPrice: 6403.14,
    earlyBuyAverage: 7915.27,
  },
  {
    assetPrice: 8744.43,
    earlyBuyAverage: 8081.1,
  },
  {
    assetPrice: 9427.12,
    earlyBuyAverage: 8305.44,
  },
  {
    assetPrice: 9149.72,
    earlyBuyAverage: 8424.65,
    lateBuyAverage: 9149.72,
  },
  {
    assetPrice: 10904.92,
    earlyBuyAverage: 8734.68,
    lateBuyAverage: 10133.01,
  },
  {
    assetPrice: 11300.4,
    earlyBuyAverage: 9019.76,
    lateBuyAverage: 10582.5,
  },
  {
    assetPrice: 10743.19,
    earlyBuyAverage: 9192.11,
    lateBuyAverage: 10604.88,
  },
  {
    assetPrice: 13060.79,
    earlyBuyAverage: 9543.8,
    lateBuyAverage: 11140.51,
  },
  {
    assetPrice: 18753.29,
    earlyBuyAverage: 10311.26,
    lateBuyAverage: 12140.47,
  },
  {
    assetPrice: 24671.11,
    earlyBuyAverage: 11415.86,
    lateBuyAverage: 14180.86,
  },
];

export const DCAChartTiming = () => {
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
            name="Early buy average price"
          />
          <Area
            type="monotone"
            dataKey="lateBuyAverage"
            stroke={secundary}
            fillOpacity={0}
            strokeWidth={2}
            fill="url(#colorBalanceCrypto)"
            name="Late buy average price"
          />

          <Tooltip
            content={<CustomTooltip title="Early Vs. Late investing" />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DCAChartTiming;
