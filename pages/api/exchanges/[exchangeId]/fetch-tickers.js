import ccxt from "ccxt";
import dayjs from "dayjs";

const isProd = process.env.NODE_ENV === "production";

export default async (req, res) => {
  const credentials = JSON.parse(req.query.credentials);

  const key = credentials.api_key;
  const secret = credentials.secret_key;
  const passphrase = credentials.passphrase;

  const exchangeClient = new ccxt[req.query.exchangeId]({
    apiKey: key,
    secret,
    password: passphrase,
  });

  // Set sandbox environment in testing
  exchangeClient.setSandboxMode(!isProd);

  const tenDaysAgo = dayjs(req.query.since).subtract(30, "day");

  const tickers = await exchangeClient.fetchOHLCV(
    req.query.symbol,
    "1d",
    new Date(tenDaysAgo).getTime()
  );

  const output = tickers.map((tick) => ({
    date: tick[0],
    price: tick[4],
  }));

  res.status(200).json(output);
};
