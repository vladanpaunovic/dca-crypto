import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import coinGeckoClient from "../../../server/coinGeckoClient";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=600"); // 10 minutes

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  let response;
  let output;

  try {
    response = await coinGeckoClient.get(`coins/${req.query.coinId}`, {
      params: {
        tickers: false,
        community_data: false,
        developer_data: false,
        localization: false,
      },
    });

    output = {
      ...response.data,
      image: response.data.image.thumb,
    };
  } catch (error) {
    output = null;
  }

  res.status(200).json(output);
};

export default Sentry.withSentry(handler);
