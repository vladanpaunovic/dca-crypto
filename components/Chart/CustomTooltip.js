import { useCurrentCoin } from "../Context/mainReducer";
import Currency from "../Currency/Currency";
import { CalendarIcon } from "@heroicons/react/outline";

const mapFormatting = (entry) => {
  const currentCoin = useCurrentCoin();
  switch (entry.dataKey) {
    case "balanceCrypto":
      return (
        <>
          {entry.name}: {entry.value} {currentCoin.symbol.toUpperCase()}
        </>
      );
    case "percentageChange": {
      return (
        <>
          <span
            className={`${
              entry.value >= 0 ? "bg-green-400" : "bg-red-400"
            } mt-4 rounded inline-block px-2 text-sm text-white dark:text-gray-900`}
          >
            {entry.name}: {entry.value > 0 ? `+${entry.value}` : entry.value}%
          </span>
        </>
      );
    }
    default:
      return (
        <>
          {entry.name}: <Currency value={entry.value} />
        </>
      );
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 transition-shadow border rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-200 flex items-center">
          <span className="mr-1">
            <CalendarIcon width={16} height={16} />
          </span>{" "}
          {label}
        </p>
        {payload.map((e, index) => (
          <p
            key={`${e.value}-${index}`}
            style={{ color: e.color }}
            className="text-sm"
          >
            {mapFormatting(e)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
