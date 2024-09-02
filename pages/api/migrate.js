import redis, { upstashAdopter } from "../../server/redis";

import prismaClient from "../../server/prisma/prismadb";
import { mapUser } from "../../server/migration.js/mappers";

const accountByUserIdPrefix = "user:account:by-user-id:";
const sessionByUserIdKeyPrefix = "user:session:by-user-id:";

async function handler(req, res) {
  const allUserIds = await redis.keys("user:account:by-user-id:*");

  let output = [];

  console.log("allUserIds.length", allUserIds.length);

  for (const i in allUserIds) {
    const userId = allUserIds[i].replace("user:account:by-user-id:", "");

    const accountByUserKey = accountByUserIdPrefix + userId;
    const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId;
    const user = upstashAdopter.getUser(userId);
    const accountKey = await redis.get(accountByUserKey);
    const account = redis.get(accountKey);
    const sessionKey = await redis.get(sessionByUserIdKey);
    const session = redis.get(sessionKey);

    const userObject = await Promise.all([user, account, session]);

    const mappedUser = mapUser(userObject[0], userObject[1]);

    try {
      console.log(
        `#${parseInt(i) + 1}/${allUserIds.length} Storing user: ${
          mappedUser.email
        }...`
      );
      const stored = await prismaClient.user.create({ data: mappedUser });
      output.push(stored);
    } catch (error) {
      console.log(error);
    }
  }

  res.status(200).json({ count: output.length, output });
}

export default handler;
