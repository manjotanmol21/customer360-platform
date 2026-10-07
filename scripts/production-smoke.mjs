const frontendUrl = (
  process.env.FRONTEND_URL ??
  "https://customer360-frontend-v31t.onrender.com"
).replace(/\/+$/, "");

const backendUrl = (
  process.env.BACKEND_URL ??
  "https://customer360-platform-2a9p.onrender.com"
).replace(/\/+$/, "");

const maxAttempts = Number.parseInt(
  process.env.SMOKE_MAX_ATTEMPTS ?? "8",
  10,
);

const timeoutMs = Number.parseInt(
  process.env.SMOKE_TIMEOUT_MS ?? "20000",
  10,
);

const retryDelayMs = Number.parseInt(
  process.env.SMOKE_RETRY_DELAY_MS ?? "10000",
  10,
);

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const validateConfiguration = () => {
  const urls = [
    ["FRONTEND_URL", frontendUrl],
    ["BACKEND_URL", backendUrl],
  ];

  for (const [name, value] of urls) {
    const parsedUrl = new URL(value);

    if (parsedUrl.protocol !== "https:") {
      throw new Error(
        `${name} must use HTTPS.`,
      );
    }
  }

  const numericSettings = [
    ["SMOKE_MAX_ATTEMPTS", maxAttempts],
    ["SMOKE_TIMEOUT_MS", timeoutMs],
    ["SMOKE_RETRY_DELAY_MS", retryDelayMs],
  ];

  for (const [name, value] of numericSettings) {
    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new Error(
        `${name} must be a positive integer.`,
      );
    }
  }
};

const requestWithRetry = async (
  url,
  options = {},
) => {
  let lastError;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt += 1
  ) {
    try {
      const response = await fetch(
        url,
        {
          ...options,
          redirect: "follow",
          signal:
            AbortSignal.timeout(timeoutMs),
        },
      );

      const responseText =
        await response.text();

      if (
        response.status >= 500 &&
        attempt < maxAttempts
      ) {
        console.log(
          `  Attempt ${attempt}/${maxAttempts} returned HTTP ${response.status}; retrying.`,
        );

        await sleep(retryDelayMs);
        continue;
      }

      return {
        response,
        responseText,
      };
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      console.log(
        `  Attempt ${attempt}/${maxAttempts} failed; retrying.`,
      );

      await sleep(retryDelayMs);
    }
  }

  throw new Error(
    `Request failed after ${maxAttempts} attempts: ${
      lastError instanceof Error
        ? lastError.message
        : String(lastError)
    }`,
  );
};

const parseJson = (
  responseText,
  description,
) => {
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(
      `${description} did not return valid JSON.`,
    );
  }
};

const assertCondition = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(message);
  }
};

const assertStatus = (
  response,
  expectedStatus,
  description,
) => {
  assertCondition(
    response.status === expectedStatus,
    `${description} returned HTTP ${response.status}; expected ${expectedStatus}.`,
  );
};

const tests = [];

const test = (
  name,
  operation,
) => {
  tests.push({
    name,
    operation,
  });
};

test(
  "Frontend home page",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      frontendUrl,
    );

    assertStatus(
      response,
      200,
      "Frontend home page",
    );

    assertCondition(
      /<div\s+id=["']root["']\s*><\/div>/i
        .test(responseText),
      "Frontend home page is missing the React root element.",
    );
  },
);

test(
  "Frontend direct login route",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${frontendUrl}/login`,
    );

    assertStatus(
      response,
      200,
      "Frontend login route",
    );

    assertCondition(
      /<div\s+id=["']root["']\s*><\/div>/i
        .test(responseText),
      "The SPA rewrite did not return the React application.",
    );
  },
);

test(
  "Backend general health",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${backendUrl}/api/health`,
    );

    assertStatus(
      response,
      200,
      "General health endpoint",
    );

    const body = parseJson(
      responseText,
      "General health endpoint",
    );

    assertCondition(
      body.status === "ok",
      "General health status is not ok.",
    );

    assertCondition(
      response.headers.get(
        "cache-control",
      ) === "no-store",
      "General health response is missing Cache-Control: no-store.",
    );
  },
);

test(
  "Backend liveness",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${backendUrl}/api/health/live`,
    );

    assertStatus(
      response,
      200,
      "Liveness endpoint",
    );

    const body = parseJson(
      responseText,
      "Liveness endpoint",
    );

    assertCondition(
      body.status === "ok" &&
      body.checks?.api === "up",
      "The API did not report itself as alive.",
    );
  },
);

test(
  "Database readiness and production CORS",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${backendUrl}/api/health/ready`,
      {
        headers: {
          Origin: frontendUrl,
        },
      },
    );

    assertStatus(
      response,
      200,
      "Readiness endpoint",
    );

    const body = parseJson(
      responseText,
      "Readiness endpoint",
    );

    assertCondition(
      body.status === "ok" &&
      body.checks?.database === "up",
      "The production database is not ready.",
    );

    assertCondition(
      response.headers.get(
        "access-control-allow-origin",
      ) === frontendUrl,
      "The backend did not allow the production frontend origin.",
    );

    assertCondition(
      Boolean(
        response.headers.get(
          "x-request-id",
        ),
      ),
      "The readiness response is missing X-Request-ID.",
    );
  },
);

test(
  "Security headers",
  async () => {
    const {
      response,
    } = await requestWithRetry(
      `${backendUrl}/api/health`,
    );

    assertStatus(
      response,
      200,
      "Security-header request",
    );

    assertCondition(
      response.headers.get(
        "x-content-type-options",
      ) === "nosniff",
      "X-Content-Type-Options is missing or incorrect.",
    );

    assertCondition(
      response.headers.get(
        "x-frame-options",
      ) === "SAMEORIGIN",
      "X-Frame-Options is missing or incorrect.",
    );

    assertCondition(
      Boolean(
        response.headers.get(
          "content-security-policy",
        ),
      ),
      "Content-Security-Policy is missing.",
    );

    assertCondition(
      !response.headers.has(
        "x-powered-by",
      ),
      "The response exposes X-Powered-By.",
    );
  },
);

test(
  "Unapproved CORS origin rejection",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${backendUrl}/api/health`,
      {
        headers: {
          Origin:
            "https://untrusted.example.com",
        },
      },
    );

    assertStatus(
      response,
      403,
      "Unapproved CORS-origin request",
    );

    const body = parseJson(
      responseText,
      "CORS rejection",
    );

    assertCondition(
      body.success === false &&
      body.message ===
        "Origin is not allowed by CORS",
      "The unapproved origin returned an unexpected response.",
    );

    assertCondition(
      !response.headers.has(
        "access-control-allow-origin",
      ),
      "The rejected origin received an allow-origin header.",
    );
  },
);

test(
  "Protected customer endpoint",
  async () => {
    const {
      response,
    } = await requestWithRetry(
      `${backendUrl}/api/customers`,
    );

    assertStatus(
      response,
      401,
      "Unauthenticated customer request",
    );

    assertCondition(
      Boolean(
        response.headers.get(
          "ratelimit",
        ),
      ),
      "The protected endpoint is missing the RateLimit header.",
    );

    assertCondition(
      Boolean(
        response.headers.get(
          "ratelimit-policy",
        ),
      ),
      "The protected endpoint is missing the RateLimit-Policy header.",
    );

    assertCondition(
      !response.headers.has(
        "x-ratelimit-limit",
      ),
      "A legacy X-RateLimit header was returned.",
    );
  },
);

test(
  "Unknown API route",
  async () => {
    const {
      response,
      responseText,
    } = await requestWithRetry(
      `${backendUrl}/api/production-smoke-route-not-found`,
    );

    assertStatus(
      response,
      404,
      "Unknown API route",
    );

    const body = parseJson(
      responseText,
      "Unknown API route",
    );

    assertCondition(
      body.success === false &&
      body.message ===
        "API route not found",
      "The unknown route returned an unexpected JSON response.",
    );

    assertCondition(
      response.headers
        .get("content-type")
        ?.includes("application/json"),
      "The unknown API route did not return JSON.",
    );
  },
);

const run = async () => {
  validateConfiguration();

  console.log(
    "Customer360 production smoke tests",
  );

  console.log(
    `Frontend: ${frontendUrl}`,
  );

  console.log(
    `Backend:  ${backendUrl}`,
  );

  console.log("");

  let failedTests = 0;

  for (const {
    name,
    operation,
  } of tests) {
    const startedAt = Date.now();

    try {
      await operation();

      const duration =
        Date.now() - startedAt;

      console.log(
        `PASS  ${name} (${duration} ms)`,
      );
    } catch (error) {
      failedTests += 1;

      console.error(
        `FAIL  ${name}`,
      );

      console.error(
        `      ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      );
    }
  }

  console.log("");

  if (failedTests > 0) {
    throw new Error(
      `${failedTests} production smoke test(s) failed.`,
    );
  }

  console.log(
    `All ${tests.length} production smoke tests passed.`,
  );
};

run().catch((error) => {
  console.error("");

  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );

  process.exitCode = 1;
});