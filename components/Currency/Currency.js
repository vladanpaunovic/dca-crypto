import { defaultCurrency } from "../../config";
import { useAppContext } from "../Context/Context";

export const formatPrice = (value, currency) =>
  parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: currency || defaultCurrency,
    minimumFractionDigits: 0,
  });

const Currency = ({ value, ...props }) => {
  const context = useAppContext();
  if (isNaN(value)) {
    throw new TypeError("The value inserted is not a number");
  }

  return (
    <span {...props}>
      {formatPrice(value, context.state.settings.currency)}
    </span>
  );
};

export default Currency;
