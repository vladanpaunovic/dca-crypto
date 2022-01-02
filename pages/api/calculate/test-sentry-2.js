import * as Sentry from "@sentry/nextjs";

function handler(req) {
  throw new Error("Sentry from the backend");
}

export default Sentry.withSentry(handler);
