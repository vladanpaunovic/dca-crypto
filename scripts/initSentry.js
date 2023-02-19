const Sentry = require("@sentry/node");
const { PrismaClient } = require("@prisma/client");
const Tracing = require("@sentry/tracing");

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const client = new PrismaClient();

const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.5,
    integrations: [new Tracing.Integrations.Prisma({ client })],
  });

  return Sentry;
};

module.exports = initSentry;
