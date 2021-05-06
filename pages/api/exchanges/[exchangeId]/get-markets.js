import ccxt from "ccxt";

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
  exchangeClient.setSandboxMode(process.env.IS_SANDBOX);

  const markets = await exchangeClient.fetchMarkets();

  res.status(200).json(markets);
};
