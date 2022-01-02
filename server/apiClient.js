import axios from "axios";
import { WEBSITE_URL } from "../config";

const prefix = process.env.IS_PROD ? "https://" : "http://";

const apiClient = axios.create({
  baseURL: `${prefix}${WEBSITE_URL}/api`,
});

export default apiClient;
