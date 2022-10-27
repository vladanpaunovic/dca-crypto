import * as Sentry from "@sentry/nextjs";
import prismaClient from "../../../server/prisma/prismadb";

async function handler(req, res) {
  const ACTION_KEY = req.headers.authorization.split(" ")[1];

  try {
    if (ACTION_KEY === process.env.STRIPE_ENCRYPTION_SECRET) {
      const usersWithWeeklyPass = await prismaClient.subscription.updateMany({
        where: { type: "week_pass", ends_on: { gte: new Date() } },
        data: { status: "expired" },
      });

      res.status(200).json({ status: "ok", usersWithWeeklyPass });
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).send("Server error");
  }
}

export default Sentry.withSentry(handler);
