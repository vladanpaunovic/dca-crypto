import axios from "axios";
import dayjs from "dayjs";
import getPercentageChange from "../../../components/helpers/getPercentageChange";
import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import { spanStatusfromHttpCode } from "@sentry/tracing";
import { canUserProceed, storeFingerprint } from "../../../server/redis";
import { setCookie } from "cookies-next";
import { FINGERPRING_ID } from "../../../common/fingerprinting";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

export const generateDCAResponse = ({ response, payload, canProceed }) => {
  const data = response.prices.map((entry) => ({
    date: new Date(entry[0]).toLocaleDateString(),
    coinPrice: parseFloat(entry[1]).toFixed(6),
  }));

  const reduced = data.reduce((prev, current, index) => {
    if (index === 0) {
      return [current];
    }

    const isNth = index % parseInt(payload.investmentInterval) === 0;
    if (isNth) {
      // Make sure there are no duplicates
      if (prev.find((e) => e.date === current.date)) {
        return prev;
      }

      return [...prev, current];
    }

    return prev;
  }, []);

  let allCrypto = [];
  let prices = [];

  const chartData = reduced.map((entry, index) => {
    const coinPrice = parseFloat(entry.coinPrice);
    prices.push(coinPrice);
    const cryptoAmountInThisPurchase =
      coinPrice === 0 ? 0 : parseFloat(payload.investment) / coinPrice;

    allCrypto.push(cryptoAmountInThisPurchase);
    const balanceCrypto = allCrypto.reduce((p, c) => p + c, 0);

    const totalFIAT = (index + 1) * payload.investment;

    const costAverage = parseFloat(totalFIAT / balanceCrypto);

    const balanceFIAT = parseFloat(balanceCrypto * entry.coinPrice);

    const percentageChange = getPercentageChange(totalFIAT, balanceFIAT);

    return {
      ...entry,
      Price: coinPrice,
      "Total investment": totalFIAT,
      totalCrypto: cryptoAmountInThisPurchase,
      "Average cost": costAverage,
      "Balance in FIAT": balanceFIAT,
      balanceCrypto,
      percentageChange,
    };
  });

  const lastItem = chartData[chartData.length - 1];
  const { balanceCrypto, percentageChange } = lastItem;

  const output = {
    canProceed,
    chartData,
    insights: {
      totalInvestment: lastItem["Total investment"] || payload.investment,
      totalValue: {
        crypto: balanceCrypto.toFixed(6),
        fiat: lastItem["Balance in FIAT"],
      },
      percentageChange,
      duration: dayjs(payload.dateTo).diff(payload.dateFrom),
      opportunityCost: chartData[0].balanceCrypto * lastItem["Price"],
      lumpSum:
        (payload.investment / chartData[0].coinPrice) * lastItem["Price"],
      coinPrice: lastItem["Price"],
      costAverage: lastItem["Average cost"],
    },
  };

  return output;
};

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

  const output = generateDCAResponse({ response, payload, canProceed });

  span.finish();
  transaction.finish();

  res.status(200).json(output);
};

export default Sentry.withSentry(handler);
