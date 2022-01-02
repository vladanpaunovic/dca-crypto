import Cors from "cors";
import { WEBSITE_PATHNAME } from "../config";
import * as Sentry from "@sentry/nextjs";

const VERCEL_URL = process.env.VERCEL_URL || null;
var whitelist = [WEBSITE_PATHNAME, VERCEL_URL];

const corsOptions = {
  origin: function (origin, cb) {
    const isAllowed = whitelist.includes(origin);
    const verb = isAllowed ? "Accepting" : "Denying";

    Sentry.addBreadcrumb({
      level: Sentry.Severity.Info,
      message: `${verb} CORS request from origin: ${origin}`,
    });

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`Origin - (${origin}) blocked by CORS policy`));
    }
  },
  methods: ["GET", "HEAD", "OPTIONS", "POST"],
  optionsSuccessStatus: 200,
};

const getCORSConfig = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return corsOptions;
  } else {
    Sentry.addBreadcrumb({
      level: Sentry.Severity.Warning,
      message: "Dangerous CORS policy in use",
    });

    return { ...corsOptions, origin: "*" };
  }
};

// Initializing the cors middleware
const cors = Cors(getCORSConfig());

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runCorsMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

export const checkCORS = async (req, res) =>
  await runCorsMiddleware(req, res, cors);
