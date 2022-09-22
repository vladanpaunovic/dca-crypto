import axios from "axios";
import dayjs from "dayjs";
import getPercentageChange from "../../../components/helpers/getPercentageChange";
import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import { spanStatusfromHttpCode } from "@sentry/tracing";
import { canUserProceed, storeFingerprint } from "../../../server/redis";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { setCookie } from "cookies-next";
import { FINGERPRING_ID } from "../../../common/fingerprinting";

const convertDateStringToUnix = (dateString) =>
  Math.round(new Date(dateString).getTime() / 1000);

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

    const session = await unstable_getServerSession(req, res, authOptions);
    canProceed = await canUserProceed(payload.fingerprint, session);

    if (canProceed.proceed) {
      storeFingerprint(payload.fingerprint);
    }
  }

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
    {
      params: {
        vs_currency: payload.currency,
        from: convertDateStringToUnix(payload.dateFrom),
        to: convertDateStringToUnix(Date.now()),
      },
    }
  );

  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  const span = transaction.startChild({
    data: {
      result: response.data,
    },
    op: "task",
    description: `processing CoinGecko results`,
  });

  span.setStatus(spanStatusfromHttpCode(response.status));

  if (!response.data.prices) {
    throw new Error("No data received from the CoinGecko");
  }

  const data = response.data.prices.map((entry) => ({
    date: new Date(entry[0]).toLocaleDateString(),
    coinPrice: parseFloat(entry[1]).toFixed(6),
  }));

  const reduced = data.reduce((prev, current, index) => {
    if (index === 0) {
      return [current];
    }

    const isNth = index % 7 === 0;
    if (isNth) {
      // Make sure there are no duplicates
      if (prev.find((e) => e.date === current.date)) {
        return prev;
      }

      return [...prev, current];
    }

    return prev;
  }, []);

  const firstInvestment = reduced[0];

  const chartData = reduced.map((entry) => {
    const coinPrice = parseFloat(firstInvestment.coinPrice);

    const totalCrypto =
      coinPrice === 0 ? 0 : parseFloat(payload.investment) / coinPrice;

    const totalFIAT = payload.investment;
    const balanceFIAT = (totalCrypto * entry.coinPrice).toFixed(2);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      totalFIAT: payload.investment,
      totalCrypto,
      costAverage: coinPrice,
      balanceFIAT,
      balanceCrypto: totalCrypto,
      percentageChange,
    };
  });

  const mostRecentEntry = chartData[chartData.length - 1];

  const totalInvestment = mostRecentEntry.totalFIAT;
  const totalValueFIAT = mostRecentEntry.balanceFIAT;
  const percentageChange = mostRecentEntry.percentageChange;
  const totalValueCrypto = mostRecentEntry.balanceCrypto;

  const output = {
    canProceed,
    chartData,
    insights: {
      totalInvestment,
      totalValue: { crypto: totalValueCrypto, fiat: totalValueFIAT },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * mostRecentEntry.coinPrice,
    },
  };

  span.finish();
  transaction.finish();

  res.status(200).json(output);
};

export default Sentry.withSentry(handler);
