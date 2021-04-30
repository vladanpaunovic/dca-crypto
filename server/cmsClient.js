import axios from "axios";

const cmsClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CMS_URL,
});

export default cmsClient;
