import ccxt from "ccxt";
import { withSentry } from "@sentry/nextjs";
import { decrypt } from "../../../../server/cryptography";

const handler = async (req, res) => {
  let output = { validated: false };

  const credentials = JSON.parse(decrypt(req.body.credentials));
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
    if (process.env.IS_SANDBOX) {
      exchangeClient.setSandboxMode(true);
    }

    const balance = await exchangeClient.fetchBalance();
    output = balance;
  } catch (error) {
    output = { error };
  }

  res.status(200).json(output);
};

export default withSentry(handler);
