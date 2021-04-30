import axios from "axios";

const cmsClient = (accessToken = null) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_CMS_URL,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

export default cmsClient;
