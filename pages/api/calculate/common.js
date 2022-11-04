import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import { spanStatusfromHttpCode } from "@sentry/tracing";
import { canUserProceed, storeFingerprint } from "../../../server/redis";
import { setCookie } from "cookies-next";
import { FINGERPRING_ID } from "../../../common/fingerprinting";
import { generateDCAResponse } from "./dca";
import { generateLumpSumResponse } from "./lump-sum";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

const handler = async (req, res) => {
  await checkCORS(req, res);

  const payload = { ...req.body };

  Sentry.setContext("Payload", payload);

  let canProceed = { proceed: true };

  if (payload.fingerprint) {
    setCookie(FINGERPRING_ID, payload.fingerprint, {
      req,
      res,
      secure: true,
      maxAge: 3600 * 24,
      sameSite: "lax",
    });

    canProceed = await canUserProceed(payload.fingerprint, payload.session);
    if (canProceed.proceed) {
      storeFingerprint(payload.fingerprint);
    }
  }

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
    {
      params: {
        from: convertDateStringToUnix(payload.dateFrom),
        to: convertDateStringToUnix(payload.dateTo),
        vs_currency: payload.currency,
      },
    }
  );

  if (!response.data.prices.length) {
    res.status(200).json({
      canProceed,
      error: {
        message: `No market data yet for ${payload.coinId} yet`,
        subheading: "Try changing the coin or extending the investment period",
      },
    });
    return;
  }

  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  const span = transaction.startChild({
    data: {
      result: response.data,
    },
    op: "task",
    description: `processing CoinGecko results`,
  });

  span.setStatus(spanStatusfromHttpCode(response.status));

  const dca = generateDCAResponse({ response, payload, canProceed });
  const lumpSum = generateLumpSumResponse({
    response,
    payload,
    canProceed,
  });

  span.finish();
  transaction.finish();

  // TODO - REMOVE!
  canProceed = { proceed: true };

  res.status(200).json({ dca, lumpSum, canProceed, input: payload });
};

export default Sentry.withSentry(handler);
