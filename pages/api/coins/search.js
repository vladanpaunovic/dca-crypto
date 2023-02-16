import * as Sentry from "@sentry/nextjs";
import { checkCORS } from "../../../server/cors";
import prismaClient from "../../../server/prisma/prismadb";

const handler = async (req, res) => {
  await checkCORS(req, res);
  res.setHeader("Cache-Control", "s-maxage=864000"); // 10 days

  const payload = req.query;

  if (!payload.query) {
    return res.status(400).json({ error: "Missing query" });
  }

  if (payload.query.length < 3) {
    return res.json([]);
  }

  Sentry.setContext("Payload", payload);
  // Fuzzy search for the coin in the database
  const allCoins = await prismaClient.cryptocurrency.findMany({
    where: {
      OR: [
        {
          name: {
            contains: payload.query,
            mode: "insensitive",
          },
        },
        {
          symbol: {
            contains: payload.query,
            mode: "insensitive",
          },
        },
      ],
    },
    take: 10,
    select: {
      coinId: true,
      name: true,
      symbol: true,
      marketCapRank: true,
    },
  });

  res.status(200).json(allCoins);
};

export default Sentry.withSentry(handler);
