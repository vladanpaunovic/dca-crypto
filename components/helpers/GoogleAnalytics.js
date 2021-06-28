// log specific events happening.
export const googleAnalyticsEvent = ({ action, params }) => {
  if (!window || !window.dataLayer) {
    return;
  }

  window.dataLayer.push({ event: action, ...params });
};
