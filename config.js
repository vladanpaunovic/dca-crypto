export const GA_TRACKING_ID = "G-G5V69VXBHC";

export const availableCurrencies = [
  { name: "USD", value: "usd" },
  { name: "EUR", value: "eur" },
  { name: "GBP", value: "gbp" },
  { name: "JPY", value: "jpy" },
  { name: "RUB", value: "rub" },
];

export const defaultCurrency = availableCurrencies[0].value;

export const CACHE_INVALIDATION_INTERVAL = 3600; // 1 hour

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "www.dca-cc.com"
    : process.env.NEXT_PUBLIC_VERCEL_URL;

export const WEBSITE_PREFIX =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "https://" : "http://";
export const WEBSITE_PATHNAME = WEBSITE_PREFIX + WEBSITE_URL;
