import axios from "axios";
import { WEBSITE_URL } from "../config";

const apiClient = axios.create({ baseURL: `/api` });

export default apiClient;
