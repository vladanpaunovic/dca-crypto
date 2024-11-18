export const availableCurrencies = [
  { name: "USD", value: "usd" },
  { name: "EUR", value: "eur" },
  { name: "GBP", value: "gbp" },
  { name: "JPY", value: "jpy" },
  { name: "RUB", value: "rub" },
];

export const defaultCurrency = availableCurrencies[0].value;

export const CACHE_INVALIDATION_INTERVAL = 3600; // 1 hour

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const WEBSITE_URL = IS_PROD
  ? "www.dca-cc.com"
  : process.env.NEXT_PUBLIC_VERCEL_URL;

export const WEBSITE_PREFIX = IS_PROD ? "https://" : "http://";
export const WEBSITE_PATHNAME = WEBSITE_PREFIX + WEBSITE_URL;

export const WEBSITE_EMAIL = "dcacryptocurrency@gmail.com";

export const FREE_TIER_REDIS_TTL = 3600 * 24; // 24 hours
export const FREE_TIER_CALCULATION_LIMIT = 5;
