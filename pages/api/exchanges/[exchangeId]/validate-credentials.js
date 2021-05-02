import ccxt from "ccxt";
const isProd = process.env.NODE_ENV === "production";

export default async (req, res) => {
  let output = { validated: false };

  try {
    const credentials = JSON.parse(req.body.credentials);

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
    output = { validated: await exchangeClient.fetchBalance() };
  } catch (error) {
    output = { validated: false, error };
  }

  res.status(200).json(output);
};
