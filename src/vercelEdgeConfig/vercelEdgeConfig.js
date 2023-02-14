import { createClient } from "@vercel/edge-config";
// Fetch a single value from one config
const vercelEdgeConfig = createClient(process.env.EDGE_CONFIG);

export const getAllAvailableCoins = async () => {
  const availableCoins = await vercelEdgeConfig.get("available-coins");

  if (availableCoins) {
    return availableCoins;
  }

  return [];
};

export default vercelEdgeConfig;
