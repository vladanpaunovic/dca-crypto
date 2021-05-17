import ccxt from "ccxt";
import { withSentry } from "@sentry/nextjs";

const handler = async (req, res) => {
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
    if (process.env.IS_SANDBOX) {
      exchangeClient.setSandboxMode(true);
    }

    output = { validated: await exchangeClient.fetchBalance() };
  } catch (error) {
    output = { validated: false, error };
  }

  res.status(200).json(output);
};

export default withSentry(handler);
