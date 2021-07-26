import { formatCurrency } from "@coingecko/cryptoformat";

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

export default CustomTooltip;
