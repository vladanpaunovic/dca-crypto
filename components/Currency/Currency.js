import { useAppContext } from "../Context/Context";

const Currency = ({ value }) => {
  const context = useAppContext();
  if (value === NaN) {
    throw new TypeError("The value inserted is not a");
  }

  const currency = parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: context.state.settings.currency,
    minimumFractionDigits: 2,
  });

  return <>{currency}</>;
};

export default Currency;
