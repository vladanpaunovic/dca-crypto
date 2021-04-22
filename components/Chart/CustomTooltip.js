import Currency from "../Currency/Currency";

const mapFormatting = (entry) => {
  switch (entry.dataKey) {
    case "balanceCrypto":
      return (
        <>
          {entry.name}: {entry.value}
        </>
      );
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
        <p className="text-sm text-gray-500 dark:text-gray-200">{label}</p>
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
