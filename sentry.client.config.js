// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.3,
  tunnel: "/sentry-tunnel",
  // Temporary disbale report dialog - workaround for react hydration error
  // beforeSend(event) {
  //   // Check if it is an exception, and if so, show the report dialog
  //   if (event.exception) {
  //     Sentry.showReportDialog({ eventId: event.event_id });
  //   }
  //   return event;
  // },
});
