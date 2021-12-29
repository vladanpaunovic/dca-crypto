import * as Sentry from "@sentry/nextjs";

function handler(req, res) {
  throw new Error("Sentry from the backend");
  res.status(200).json({ status: "ok" });
}

export default Sentry.withSentry(handler);
