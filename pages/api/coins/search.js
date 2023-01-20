import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import coinGeckoClient from "../../../server/coinGeckoClient";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=864000"); // 10 days

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  const response = await coinGeckoClient.get(`search/?query=${payload.query}`);

  const allCoins = response.data;

  res.status(200).json(allCoins);
};

export default Sentry.withSentry(handler);
