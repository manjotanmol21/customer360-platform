type LogLevel =
  | "info"
  | "error";

type LogContext =
  Record<string, unknown>;

function writeLog(
  level: LogLevel,
  event: string,
  context: LogContext = {},
): void {
  const logEntry = {
    ...context,
    timestamp:
      new Date().toISOString(),
    level,
    event,
  };

  const serializedLog =
    JSON.stringify(logEntry);

  if (level === "error") {
    console.error(serializedLog);
    return;
  }

  console.log(serializedLog);
}

export const logger = {
  info(
    event: string,
    context?: LogContext,
  ): void {
    writeLog(
      "info",
      event,
      context,
    );
  },

  error(
    event: string,
    context?: LogContext,
  ): void {
    writeLog(
      "error",
      event,
      context,
    );
  },
};