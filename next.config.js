const generateSitemap = require("./scripts/generate-sitemap.js");

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateSitemap();
    }
    return config;
  },
};
