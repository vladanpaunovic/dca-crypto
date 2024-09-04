/**
 *
 * @param {object} data
 * @param data.name - The name of the event
 * @param data.url - The URL of the page where the event occurred
 * @param userAgent
 * @param ipAddress
 * @returns
 */
export async function trackPlausibleEvent(data, userAgent, ipAddress) {
  try {
    const response = await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: {
        "User-Agent": userAgent,
        "X-Forwarded-For": ipAddress,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        domain: "dca-cc.com",
      }),
    });

    if (response.ok) {
      return;
    } else {
      throw new Error(`Failed to track event: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Error in trackEvent: ${error.message}`);
  }
}
