import { apiRatelimit, geminiRatelimit, authRatelimit } from "../config/upstash.js";

const createRateLimiter = (limiter, keyFn) => async (req, res, next) => {
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
    next(); // Fail open on Redis outage
  }
};

// Auth 
export const authLimiter = createRateLimiter(
  authRatelimit,
  (req) => req.ip ?? "unknown"
);


export const apiLimiter = createRateLimiter(
  apiRatelimit,
  (req) => `user:${req.user?.id ?? req.ip}`
);

export const geminiLimiter = createRateLimiter(
  geminiRatelimit,
  (req) => `user:${req.user?.id ?? req.ip}`
);