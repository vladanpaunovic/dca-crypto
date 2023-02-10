import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import { getAllAvailableCoins } from "../../../server/redis";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=864000"); // 10 day

  const payload = req.query;

  Sentry.setContext("Payload", payload);

  const response = await getAllAvailableCoins(payload.currency || "USD");

  res.status(200).json(response);
};

export default Sentry.withSentry(handler);
