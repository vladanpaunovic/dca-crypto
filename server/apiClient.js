import axios from "axios";
import { WEBSITE_URL } from "../config";

import * as Sentry from "@sentry/nextjs";

const transactionId = Sentry.getCurrentHub().getScope()._tags.transaction_id;

const prefix = process.env.IS_PROD ? "https://" : "http://";

const apiClient = axios.create({
  baseURL: `${prefix}${WEBSITE_URL}/api`,
  headers: { ...(transactionId ? { "X-Transaction-ID": transactionId } : {}) },
});

export default apiClient;
