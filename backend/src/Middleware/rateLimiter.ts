import type { Request, Response, NextFunction } from "express";
import type { Ratelimit } from "@upstash/ratelimit";
import { apiRatelimit, geminiRatelimit, authRatelimit } from "../config/upstash.js";
import type { AuthRequest } from "./auth.middleware.js";

const createRateLimiter = (
  limiter: Ratelimit,
  keyFn: (req: AuthRequest) => string
) => async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const key = keyFn(req);
    const { success, limit, remaining, reset } = await limiter.limit(key);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};

export const authLimiter = createRateLimiter(
  authRatelimit,
  (req: Request) => req.ip ?? "unknown"
);

export const apiLimiter = createRateLimiter(
  apiRatelimit,
  (req: AuthRequest) => `user:${req.user?.id ?? req.ip}`
);

export const geminiLimiter = createRateLimiter(
  geminiRatelimit,
  (req: AuthRequest) => `user:${req.user?.id ?? req.ip}`
);
