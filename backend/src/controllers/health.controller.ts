import type {
  Request,
  Response,
} from "express";

import {
  checkDatabaseReadiness,
} from "../services/health.service.js";

export function getHealth(
  _req: Request,
  res: Response,
): void {
  res
    .set("Cache-Control", "no-store")
    .status(200)
    .json({
      status: "ok",
      message:
        "Customer360 API is running",
    });
}

export function getLiveness(
  _req: Request,
  res: Response,
): void {
  res
    .set("Cache-Control", "no-store")
    .status(200)
    .json({
      status: "ok",
      message:
        "Customer360 API is alive",
      checks: {
        api: "up",
      },
    });
}

export async function getReadiness(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    await checkDatabaseReadiness();

    res
      .set("Cache-Control", "no-store")
      .status(200)
      .json({
        status: "ok",
        message:
          "Customer360 API is ready",
        checks: {
          database: "up",
        },
      });
  } catch {
    res
      .set("Cache-Control", "no-store")
      .status(503)
      .json({
        status: "unavailable",
        message:
          "Customer360 API is not ready",
        checks: {
          database: "down",
        },
      });
  }
}