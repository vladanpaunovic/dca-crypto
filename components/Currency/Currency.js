import { defaultCurrency } from "../../config";
import { useAppContext } from "../Context/Context";

export const formatPrice = (value, currency) =>
  parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: currency || defaultCurrency,
    minimumFractionDigits: 0,
  });

const Currency = ({ value }) => {
  const context = useAppContext();
  if (isNaN(value)) {
    throw new TypeError("The value inserted is not a number");
  }

  return <>{formatPrice(value, context.state.settings.currency)}</>;
};

export default Currency;
