import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();

// 1. General API — 10 req/60s
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
  prefix: "rl:api",
});

// 2. Gemini API — 5 req/60s (stricter, external paid API)
export const geminiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rl:gemini",
});

// 3. Auth — 5 req/15min (brute-force protection)
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "5m"),
  prefix: "rl:auth",
});