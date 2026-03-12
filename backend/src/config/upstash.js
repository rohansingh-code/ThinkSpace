import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();


export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
  prefix: "rl:api",
});


export const geminiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rl:gemini",
});


export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "5m"),
  prefix: "rl:auth",
});