import { useAppContext } from "../Context/Context";

export const formatPrice = (value, currency) =>
  parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  });

const Currency = ({ value }) => {
  const context = useAppContext();
  if (value === NaN) {
    throw new TypeError("The value inserted is not a");
  }

  return <>{formatPrice(value, context.state.settings.currency)}</>;
};

export default Currency;
