import ccxt from "ccxt";
import dayjs from "dayjs";
import { withSentry } from "@sentry/nextjs";
import { decrypt } from "../../../../server/cryptography";

const handler = async (req, res) => {
  const credentials = JSON.parse(decrypt(req.query.credentials));

  const key = credentials.api_key;
  const secret = credentials.secret_key;
  const passphrase = credentials.passphrase;

  const exchangeClient = new ccxt[req.query.exchangeId]({
    apiKey: key,
    secret,
    password: passphrase,
  });

  // Set sandbox environment in testing
  if (process.env.IS_SANDBOX === "true") {
    exchangeClient.setSandboxMode(true);
  }

  const tenIntervalsAgo = dayjs(req.query.since).subtract(30, "day");

  const tickers = await exchangeClient.fetchOHLCV(
    req.query.symbol,
    "1d",
    new Date(tenIntervalsAgo).getTime()
  );

  const output = tickers.map((tick) => ({
    date: tick[0],
    price: tick[4],
  }));

  res.status(200).json(output);
};

export default withSentry(handler);
