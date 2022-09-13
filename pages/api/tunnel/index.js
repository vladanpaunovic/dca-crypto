import { withSentry, captureException } from "@sentry/nextjs";
import * as urlLibrary from "url";

// Change host appropriately if you run your own Sentry instance.
const sentryHost = "o574491.ingest.sentry.io";

// Set knownProjectIds to an array with your Sentry project IDs which you
// want to accept through this proxy.
const knownProjectIds = ["/5821539"];

async function handler(req, res) {
  try {
    const envelope = req.body;
    const pieces = envelope.split("\n");

    const header = JSON.parse(pieces[0]);

    const { host, path } = urlLibrary.parse(header.dsn);
    if (host !== sentryHost) {
      throw new Error(`invalid host: ${host}`);
    }

    const projectId = path?.endsWith("/") ? path.slice(0, -1) : path;
    if (!knownProjectIds.includes(projectId || "")) {
      throw new Error(`invalid project id: ${projectId}`);
    }

    const url = `https://${sentryHost}/api/${projectId}/envelope/`;
    const response = await fetch(url, {
      method: "POST",
      body: envelope,
    });

    const sentryResponse = await response.json();
    return res.json(sentryResponse);
  } catch (e) {
    captureException(e);
    return res.status(400).json({ status: "invalid request" });
  }
}

export default withSentry(handler);
