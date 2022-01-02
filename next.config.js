require("dotenv").config();
const Mode = require("frontmatter-markdown-loader/mode");
const generateSitemap = require("./scripts/generate-sitemap.js");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require("@sentry/nextjs");

generateSitemap();

const moduleExports = (phase) => ({
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.md$/,
      loader: "frontmatter-markdown-loader",
      options: {
        mode: [Mode.BODY],
      },
    });
    return cfg;
  },
  images: {
    domains: ["img.clankapp.com", "assets.coingecko.com"],
  },
  env: {
    IS_PROD: phase === PHASE_PRODUCTION_BUILD,
  },
});

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, { silent: true });
