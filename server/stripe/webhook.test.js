import {
  createSubscription,
  handleStripeWebhook,
} from "../../pages/api/billing/webhook";
import dayjs from "dayjs";
import { prismaMock } from "../prisma/singleton";
import { stripeMock } from "../stripe/singleton";

import mockCheckoutSessionCompleted from "./mock_checkout_session_completed.mock.json";
import mockCheckoutSessionUpdated from "./mock_checkout_session_updated.mock.json";
import mockCheckoutSessionDelated from "./mock_checkout_session_delated.mock.json";

test("creates subscription", async () => {
  const payload = {
    subId: "635a53161dded0439c8e7db1",
    status: "active",
    type: "week_pass",
    created_at: dayjs().toDate(),
    ends_on: dayjs().add(7, "day").toDate(),
  };

  prismaMock.subscription.upsert.mockResolvedValue(payload);

  const out = createSubscription(payload, "6359c0d4d7787d1019589e71");

  await expect(out).resolves.toEqual(payload);
});

test("should create a week pass", async () => {
  const event = mockCheckoutSessionCompleted;
  event.data.object.metadata = { redisUserId: "6359c0d4d7787d1019589e71" };

  const payload = {
    subId: event.data.object.id,
    status: "active",
    type: "week_pass",
    created_at: dayjs().toDate(),
    ends_on: dayjs().add(7, "day").toDate(),
  };

  prismaMock.subscription.upsert.mockResolvedValue(payload);

  const out = await handleStripeWebhook(event);

  await expect(out).toEqual(payload);
});

test("should create a subscription", async () => {
  const event = mockCheckoutSessionCompleted;
  event.data.object.metadata = { redisUserId: "6359c0d4d7787d1019589e71" };
  event.data.object.mode = "subscription";

  const payload = {
    subId: event.data.object.id,
    status: "active",
    type: "week_pass",
    created_at: dayjs().toDate(),
    ends_on: dayjs().add(7, "day").toDate(),
  };

  prismaMock.subscription.upsert.mockResolvedValue(payload);
  stripeMock.subscriptions.retrieve.mockResolvedValue({
    current_period_end: dayjs().add(30, "day").toDate(),
  });

  const out = await handleStripeWebhook(event);

  await expect(out).toEqual(payload);
});

test("should update a subscription", async () => {
  const event = mockCheckoutSessionUpdated;
  event.data.object.mode = "subscription";

  const payload = {
    subId: event.data.object.id,
    status: "active",
    type: "week_pass",
    created_at: dayjs().toDate(),
    ends_on: dayjs().add(7, "day").toDate(),
  };

  prismaMock.subscription.update.mockResolvedValue(payload);
  stripeMock.subscriptions.retrieve.mockResolvedValue({
    current_period_end: dayjs().add(30, "day").toDate(),
    customer: { metadata: { redisUserId: "6359c0d4d7787d1019589e71" } },
  });

  const out = await handleStripeWebhook(event);

  await expect(out).toEqual(payload);
});

test("should delete a subscription", async () => {
  const event = mockCheckoutSessionDelated;

  const payload = {
    subId: event.data.object.id,
    status: event.data.object.status,
  };

  prismaMock.subscription.update.mockResolvedValue(payload);
  stripeMock.subscriptions.retrieve.mockResolvedValue({
    current_period_end: dayjs().add(30, "day").toDate(),
    customer: { metadata: { redisUserId: "6359c0d4d7787d1019589e71" } },
  });

  const out = await handleStripeWebhook(event);

  await expect(out).toEqual(payload);
});
