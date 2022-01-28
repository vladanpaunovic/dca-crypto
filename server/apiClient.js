import axios from "axios";
import * as Sentry from "@sentry/nextjs";

import { WEBSITE_URL } from "../config";

const prefix = process.env.IS_PROD ? "https://" : "http://";

const apiClient = axios.create({
  baseURL: `${prefix}${WEBSITE_URL}/api`,
});

let transaction;
let span;

apiClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    transaction = Sentry.startTransaction({ name: "axiosRequest" });
    Sentry.getCurrentHub().configureScope((scope) =>
      scope.setSpan(transaction)
    );

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    span = transaction.startChild({
      data: {
        result: response,
      },
      op: "task",
      description: `processing axios request`,
    });
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    span.setStatus("ok");
    span.finish();
    transaction.finish();
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    span.setStatus("unknown_error");
    span.finish();
    transaction.finish();
    return Promise.reject(error);
  }
);

export default apiClient;
