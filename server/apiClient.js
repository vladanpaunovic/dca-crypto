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
    const transactionName = `${config.method.toUpperCase()} ${config.url}`;
    transaction = Sentry.startTransaction({
      name: transactionName,
      op: "http.client",
    });

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
    const transactionName = `${response.config.method.toUpperCase()} ${
      response.config.url
    }`;
    span = transaction.startChild({
      data: {
        result: response,
      },
      op: "http.client",
      description: `Processing ${transactionName}`,
    });
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    span.setHttpStatus(response.status);
    span.finish();
    transaction.finish();
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    span = transaction.startChild({
      data: {
        result: error,
      },
      op: "http.client",
      description: `Processing failed`,
    });

    span.setStatus("unknown_error");
    span.finish();
    transaction.finish();
    return Promise.reject(error);
  }
);

export default apiClient;
