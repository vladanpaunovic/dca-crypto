// log specific events happening.
export const googleAnalyticsEvent = ({ action, params }) => {
  if (!window || !window.gtag) {
    return;
  }

  window.gtag("event", action, params);
};
