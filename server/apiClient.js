import axios from "axios";
import { WEBSITE_URL } from "../config";

const apiClient = axios.create({ baseURL: `${WEBSITE_URL}/api` });

export default apiClient;
