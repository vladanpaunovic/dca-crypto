import * as Sentry from "@sentry/nextjs";

function handler() {
  throw new Error("Sentry from the backend");
}

export default Sentry.withSentry(handler);
