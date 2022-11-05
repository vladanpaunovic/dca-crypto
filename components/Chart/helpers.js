export const kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};

export const valueFormatter = (number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  })
    .format(number)
    .toString();
