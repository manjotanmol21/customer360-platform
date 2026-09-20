import cors, {
  type CorsOptions,
} from "cors";

import {
  env,
} from "../config/env.js";

import {
  ForbiddenError,
} from "../errors/app.error.js";

const corsOptions: CorsOptions = {
  origin: (
    origin,
    callback,
  ) => {
    if (
      !origin ||
      env.corsOrigins.includes(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(
      new ForbiddenError(
        "Origin is not allowed by CORS",
      ),
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

export const corsMiddleware =
  cors(corsOptions);