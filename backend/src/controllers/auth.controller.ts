import type {
  Request,
  Response,
} from "express";

import {
  registerUser,
  type RegisterUserInput,
} from "../services/auth.service.js";

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const input =
    req.body as RegisterUserInput;

  const user =
    await registerUser(input);

  res.status(201).json({
    success: true,
    data: user,
  });
};