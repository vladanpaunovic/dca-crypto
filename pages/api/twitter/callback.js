import { withSentry } from "@sentry/nextjs";

async function handler(req, res) {
  res.status(200).json({ status: "ok" });
}

export default withSentry(handler);
