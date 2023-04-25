import { GA_TRACKING_ID } from "../../config";

// log the pageview with their URL
export const pageview = (url) => {
  if (window?.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// log specific events happening.
export const event = ({ action, params }) => {
  if (window?.gtag) {
    window?.gtag("event", action, params);
  }
};
