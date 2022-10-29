import dayjs from "dayjs";

const mapSubscription = (user) => {
  return {
    subId: user.subscription.subId || "unknown",
    status: user.subscription.status,
    type: user.subscription.type || "subscription",
    created_at: dayjs(user.subscription.created_at).toDate(),
    ends_on: dayjs(user.subscription.ends_on).toDate(),
    stripeCustomerId: user.stripeCustomerId,
  };
};

export const mapUser = (user, account) => {
  if (!user) {
    return {};
  }
  return {
    legacyRedisId: user.id, // CAREFUL HOW WE STORE IT!
    name: user.name,
    email: user.email,
    image: user.image,
    ...(user.emailVerified
      ? { emailVerified: dayjs(user.emailVerified).toDate() }
      : {}),
    ...(user.stripeCustomerId
      ? { stripeCustomerId: user.stripeCustomerId }
      : {}),

    // To Create:
    accounts: { create: mapAccount(account) },
    ...(user.subscription
      ? { subscription: { create: mapSubscription(user) } }
      : {}),
  };
};

const mapAccount = (account) => {
  if (!account) {
    return {};
  }

  return {
    provider: account.provider,
    type: account.type,
    providerAccountId: account.providerAccountId,
    access_token: account.access_token,
    expires_at: account.expires_at,
    scope: account.scope,
    token_type: account.token_type,
    id_token: account.id_token,
  };
};
