import { withSentry } from "@sentry/nextjs";

function handler(req, res) {
  res.status(200).json({ status: "ok" });
}

export default withSentry(handler);
