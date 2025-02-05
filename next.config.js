require("dotenv").config();
const Mode = require("frontmatter-markdown-loader/mode");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");
const { withSentryConfig } = require("@sentry/nextjs");
const { withPlausibleProxy } = require("next-plausible");

/** @type {import('next').NextConfig} */
const moduleExports = (phase) =>
  withPlausibleProxy()({
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
      domains: [
        "img.clankapp.com",
        "assets.coingecko.com",
        "assets.coincap.io",
        "coin-images.coingecko.com",

        // Google storage
        "storage.googleapis.com",
        "lh1.googleusercontent.com",
        "lh2.googleusercontent.com",
        "lh3.googleusercontent.com",
        "lh4.googleusercontent.com",
        "lh5.googleusercontent.com",
        "lh6.googleusercontent.com",
      ],
    },
    env: {
      IS_PROD: phase === PHASE_PRODUCTION_BUILD,
    },
    async redirects() {
      return [
        {
          source: "/",
          destination: `/dca/bitcoin`,
          permanent: true,
        },
        {
          source: "/lump-sum/:path*",
          destination: "/dca/:path*",
          permanent: true,
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: "/sentry-tunnel",
          destination: "https://o574491.ingest.sentry.io/api/5821539/envelope/",
        },
        {
          source: "/ingest/static/:path*",
          destination: "https://eu-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://eu.i.posthog.com/:path*",
        },
        {
          source: "/ingest/decide",
          destination: "https://eu.i.posthog.com/decide",
        },
      ];
    },
  });

// const config = withPlausibleProxy()(moduleExports);
// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, {
  hideSourceMaps: false,
  autoInstrumentServerFunctions: true,
});
