import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export function middleware(req) {
  const sentryTransactionId = req.headers["x-transaction-id"];

  if (sentryTransactionId) {
    Sentry.configureScope((scope) => {
      scope.setTag("transaction_id", sentryTransactionId);
    });
  }

  Sentry.addBreadcrumb({
    category: "Middleware",
    level: Sentry.Severity.Info,
    message: "Add transaction id",
    data: { sentryTransactionId },
  });

  return NextResponse.next();
}
