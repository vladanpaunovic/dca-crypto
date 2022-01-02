import * as Sentry from "@sentry/nextjs";

function handler(req) {
  console.log("test-sentry-1", req.body.payload);
  console.log("test-sentry-2", req.headers);
  throw new Error("Sentry from the backend");
}

export default Sentry.withSentry(handler);
