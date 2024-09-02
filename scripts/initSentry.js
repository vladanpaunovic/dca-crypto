const Sentry = require("@sentry/node");
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5,
    integrations: [
      Sentry.httpIntegration,
      Sentry.mongoIntegration,
      Sentry.prismaIntegration,
    ],
  });

  return Sentry;
};

module.exports = initSentry;
