import coinGeckoClient from "../../../server/coinGeckoClient";
import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=864000"); // 10 days

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  const response = await coinGeckoClient.get(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
    {
      params: {
        from: convertDateStringToUnix(payload.from),
        to: convertDateStringToUnix(payload.to),
        vs_currency: payload.vs_currency,
      },
    }
  );

  console.log({ response });

  res.status(200).json(response.data);
};

export default Sentry.withSentry(handler);
