import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import coinGeckoClient from "../../../server/coinGeckoClient";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=864000"); // 10 day

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  const response = await coinGeckoClient.get("coins/markets", {
    params: {
      vs_currency: payload.currency || "usd",
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });

  const allCoins = response.data;

  res.status(200).json(allCoins);
};

export default Sentry.withSentry(handler);
