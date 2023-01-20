import * as Sentry from "@sentry/nextjs";
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
    await twitterClient.get("account/verify_credentials");
  } catch (error) {
    Sentry.captureMessage(error.errors[0].message, { level: "error" });
    console.log(error.errors[0].message);
  }

  try {
    const response = await apiClient.get("social/content");
    const { posts } = response.data;

    const hookTweet = await twitterClient.post("statuses/update", {
      status: `${posts[0].message} ${posts[1].url}`,
      auto_populate_reply_metadata: true,
    });

    const tweet = await twitterClient.post("statuses/update", {
      status: `${posts[1].message}`,
      auto_populate_reply_metadata: true,
      in_reply_to_status_id: hookTweet.id_str,
    });

    const tweetInThread = await twitterClient.post("statuses/update", {
      status: `${posts[2].message}`,
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true,
    });

    const tweetSummary = await twitterClient.post("statuses/update", {
      status: `${posts[3].message}`,
      in_reply_to_status_id: tweetInThread.id_str,
      auto_populate_reply_metadata: true,
    });

    const tweetFinal = await twitterClient.post("statuses/update", {
      status: `Want to make sure you're maximizing your #crypto profits? Visit ${posts[1].url} to learn about using a #DCA and #Lump-sum strategy and backtest all major currencies`,
      in_reply_to_status_id: tweetSummary.id_str,
      auto_populate_reply_metadata: true,
    });

    res.status(200).json({
      status: "ok",
      tweets: [hookTweet, tweet, tweetInThread, tweetSummary, tweetFinal],
    });
  } catch (error) {
    res.status(200).json({ status: "error", ...error });
  }
}

export default Sentry.withSentry(handler);
