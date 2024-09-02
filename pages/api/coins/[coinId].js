import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=600"); // 10 minutes

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  let response;
  let output;

  try {
    response = await fetch(
      `https://api.coincap.io/v2/rates/${req.query.coinId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.COINCAP_API_KEY}`,
        },
      }
    );

    const price = await response.json();
    output = { rateUsd: price.data.rateUsd };
  } catch (error) {
    output = null;
  }

  if (!output) {
    try {
      response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${req.query.coinId}`
      );

      const price = await response.json();
      output = {
        rateUsd: String(price.market_data.current_price.usd),
      };
    } catch (error) {
      output = null;
    }
  }

  res.status(200).json(output);
};

export default handler;
