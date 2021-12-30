import * as Sentry from "@sentry/nextjs";
import apiClient from "../../../server/apiClient";

async function handler(req, res) {
  const response = await apiClient.post("calculate/test-sentry-2", {
    payload: req.headers,
  });

  res.status(200).json({ status: "ok", response: response.data });
}

export default Sentry.withSentry(handler);
