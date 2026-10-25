import { Redis } from "ioredis";
import { env } from "../config/config.service.js";

export const redisClient = new Redis(env.REDIS_URI, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redisClient.on("error", (error: unknown) => {
  console.error("Redis Client Error:", (error as Error).message);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis Connected Successfully");
  } catch (error) {
    console.error(`Redis Connection error: ${(error as Error).message}`);
  }
};

export default connectRedis;
