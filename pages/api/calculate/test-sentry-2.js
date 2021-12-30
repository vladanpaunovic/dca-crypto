import * as Sentry from "@sentry/nextjs";

function handler(req, res) {
  console.log("test-sentry-1", req.body.payload);
  console.log("test-sentry-2", req.headers);
  throw new Error("Sentry from the backend");

  res.status(500).json({ status: "test sentry 2" });
}

export default Sentry.withSentry(handler);
