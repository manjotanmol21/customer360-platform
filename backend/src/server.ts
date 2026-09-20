import app from "./app.js";

import {
  env,
} from "./config/env.js";

import {
  prisma,
} from "./lib/prisma.js";

const SHUTDOWN_TIMEOUT_MS =
  10_000;

const server = app.listen(
  env.port,
  () => {
    console.log(
      `Customer360 API running on port ${env.port}`,
    );
  },
);

let isShuttingDown = false;

const closeHttpServer =
  (): Promise<void> => {
    return new Promise(
      (resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });

        server.closeIdleConnections();
      },
    );
  };

const logShutdownError = (
  stage: string,
  error: unknown,
): void => {
  console.error(
    `Shutdown error during ${stage}:`,
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
        }
      : {
          name: "UnknownError",
        },
  );
};

const shutdown = async (
  reason: string,
  initialExitCode = 0,
): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(
    `Shutdown initiated: ${reason}`,
  );

  const forceShutdownTimer =
    setTimeout(() => {
      console.error(
        "Graceful shutdown timed out. Forcing process exit.",
      );

      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

  forceShutdownTimer.unref();

  let exitCode =
    initialExitCode;

  try {
    await closeHttpServer();

    console.log(
      "HTTP server closed.",
    );
  } catch (error) {
    exitCode = 1;

    logShutdownError(
      "HTTP server close",
      error,
    );
  }

  try {
    await prisma.$disconnect();

    console.log(
      "Database connection closed.",
    );
  } catch (error) {
    exitCode = 1;

    logShutdownError(
      "database disconnect",
      error,
    );
  }

  clearTimeout(
    forceShutdownTimer,
  );

  console.log(
    `Shutdown complete with exit code ${exitCode}.`,
  );

  process.exit(exitCode);
};

process.once(
  "SIGINT",
  () => {
    void shutdown("SIGINT");
  },
);

process.once(
  "SIGTERM",
  () => {
    void shutdown("SIGTERM");
  },
);

process.once(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught exception:",
      {
        name: error.name,
        message: error.message,
      },
    );

    void shutdown(
      "uncaughtException",
      1,
    );
  },
);

process.once(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled promise rejection:",
      reason instanceof Error
        ? {
            name: reason.name,
            message: reason.message,
          }
        : {
            name: "UnknownReason",
          },
    );

    void shutdown(
      "unhandledRejection",
      1,
    );
  },
);

export default server;