import { PostHog } from "posthog-node";

const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: "https://eu.i.posthog.com",
});

await posthogClient.shutdown(); // On program exit, call shutdown to stop pending pollers and flush any remaining events

export default posthogClient;
