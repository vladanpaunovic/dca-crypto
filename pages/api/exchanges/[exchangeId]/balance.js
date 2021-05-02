import ccxt from "ccxt";
const isProd = process.env.NODE_ENV === "production";

export default async (req, res) => {
  let output = { validated: false };
  const credentials = JSON.parse(req.body.credentials);
  const key = credentials.api_key;
  const secret = credentials.secret_key;
  const passphrase = credentials.passphrase;

  try {
    const exchangeClient = new ccxt[req.query.exchangeId]({
      apiKey: key,
      secret,
      password: passphrase,
    });

    // Set sandbox environment in testing
    exchangeClient.setSandboxMode(!isProd);
    const balance = await exchangeClient.fetchBalance();
    output = balance;
  } catch (error) {
    output = { error };
  }

  res.status(200).json(output);
};
