import { LoopsClient } from "loops";
export const loopsClient = new LoopsClient(process.env.LOOPS_API_KEY);

/**
 *
 * @param {object} options
 * @param {string} options.identifier
 * @param {string} options.url
 */
export async function sendVerificationRequest({ identifier, url }) {
  console.log("identifier", identifier, url);

  const res = await loopsClient.sendTransactionalEmail({
    email: identifier,
    transactionalId: "cm0wiuf5p01h34psttfb3rc9l", // Loops transactional ID
    dataVariables: {
      url,
    },
  });

  res.success;

  if (!res.success) {
    throw new Error("Failed to send verification email.");
  }
}
