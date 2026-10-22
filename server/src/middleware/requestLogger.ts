import type { NextFunction, Request, Response } from "express";

export function requestLogger(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  console.log(`${request.method} ${request.path}`);
  next();
}