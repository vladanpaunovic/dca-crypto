import * as Sentry from "@sentry/nextjs";
import redis, { upstashAdopter } from "../../../server/redis";
import dayjs from "dayjs";

async function handler(req, res) {
  const ACTION_KEY = req.headers.authorization.split(" ")[1];

  try {
    if (ACTION_KEY === process.env.STRIPE_ENCRYPTION_SECRET) {
      // Get all users by keys
      const allUserIds = await redis.keys("user:account:by-user-id:*");

      const allUsersPromise = allUserIds.map((id) => {
        const userId = id.replace("user:account:by-user-id:", "");
        return upstashAdopter.getUser(userId);
      });

      const allUsers = await Promise.all(allUsersPromise);

      // Filter for users with weekly pass only
      const usersWithWeeklyPass = allUsers.filter(
        (user) => user?.subscription?.type === "week_pass"
      );

      // Inspect every user whether weekly pass ended or not
      usersWithWeeklyPass.forEach(async (user) => {
        if (dayjs().isAfter(user.subscription.ends_on)) {
          console.log("WEEKLY_PASS:EXPIRED");
          await upstashAdopter.updateUser({
            id: user.id,
            subscription: { ...user.subscription, status: "expired" },
          });
        }
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
