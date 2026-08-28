import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

export const redis: Redis = Redis.fromEnv();

export const apiRatelimit: Ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
  prefix: "rl:api",
});

export const geminiRatelimit: Ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rl:gemini",
});

export const authRatelimit: Ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "5m"),
  prefix: "rl:auth",
});
