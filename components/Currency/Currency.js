import { defaultCurrency } from "../../config";
import { useStore } from "../../src/store/store";

export const formatPrice = (value, currency) =>
  parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: currency || defaultCurrency,
    minimumFractionDigits: 0,
  });

const Currency = ({ value, ...props }) => {
  const state = useStore();

  if (isNaN(value)) {
    throw new TypeError("The value inserted is not a number");
  }

  return <span {...props}>{formatPrice(value, state.settings.currency)}</span>;
};

export default Currency;
