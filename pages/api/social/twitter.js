import { withSentry } from "@sentry/nextjs";
import Twitter from "twitter-lite";
import apiClient from "../../../server/apiClient";

async function handler(req, res) {
  if (!req.body.consumer_key) {
    throw new Error("Missing consumer_key");
  }

  if (!req.body.consumer_secret) {
    throw new Error("Missing consumer_secret");
  }

  if (!req.body.access_token_key) {
    throw new Error("Missing access_token_key");
  }

  if (!req.body.access_token_secret) {
    throw new Error("Missing access_token_secret");
  }

  const twitterClient = new Twitter({
    consumer_key: req.body.consumer_key,
    consumer_secret: req.body.consumer_secret,
    access_token_key: req.body.access_token_key,
    access_token_secret: req.body.access_token_secret,
  });

  try {
    const response = await apiClient.get("social/content");
    const { posts } = response.data;

    const tweet = await twitterClient.post("statuses/update", {
      status: `${posts[0].message} ${posts[0].url}`,
      auto_populate_reply_metadata: true,
    });

    const tweetInThread = await twitterClient.post("statuses/update", {
      status: `${posts[1].message} ${posts[1].url}`,
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true,
    });

    const tweetSummary = await twitterClient.post("statuses/update", {
      status: `${posts[2].message}`,
      in_reply_to_status_id: tweetInThread.id_str,
      auto_populate_reply_metadata: true,
    });

    res.status(200).json({
      status: "ok",
      tweets: [tweet, tweetInThread, tweetSummary],
    });
  } catch (error) {
    res.status(200).json({ status: "error", ...error });
  }
}

export default withSentry(handler);
