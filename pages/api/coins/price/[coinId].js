import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../../server/cors";
import coinGeckoClient from "../../../../server/coinGeckoClient";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=600"); // 10 minutes

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  const response = await coinGeckoClient.get(
    `simple/price?ids=${payload.coinId}&vs_currencies=usd`
  );

  res.status(200).json(response.data);
};

export default Sentry.withSentry(handler);
