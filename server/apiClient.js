import axios from "axios";
import { WEBSITE_URL } from "../config";

import * as Sentry from "@sentry/nextjs";

const prefix = process.env.IS_PROD ? "https://" : "http://";

const apiClient = axios.create({
  baseURL: `${prefix}${WEBSITE_URL}/api`,
});

export default apiClient;
