const { PHASE_PRODUCTION_BUILD } = require("next/constants");
const generateSitemap = require("./scripts/generate-sitemap.js");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    generateSitemap();
  }

  return defaultConfig;
};
