import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function PosthogIdentifier() {
  const session = useSession();
  const posthog = usePostHog();

  useEffect(() => {
    if (session.data?.user && session.data.user.email) {
      // Identify sends an event, so you want may want to limit how often you call it
      posthog?.identify(session.data.user.email, {
        email: session.data.user.email,
        subscription_type: session.data.user.subscription,
        is_paid: session.data.user.hasActivePackage,
      });
      posthog?.group("subscribed", session.data.user.hasActivePackage);
    }
  }, [posthog, session.data?.user]);

  return null;
}
