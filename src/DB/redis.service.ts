import { Types } from "mongoose";
import { redisClient } from "./redis.connection.js";

export interface IRedisSetOptions {
  key: string;
  value: string | number | object;
  ttl?: number | undefined; // expiration time in seconds
}

export interface IRedisGetOptions {
  key: string;
}

export interface IRedisDelOptions {
  key: string;
}

export const revokeTokenKey = ({
  userId,
  jti,
}: {
  userId: string | Types.ObjectId;
  jti?: string | undefined;
}): string => {
  return `revokedToken::${userId.toString()}::${jti || "default"}`;
};

export const otpKey = ({
  email,
  type = "confirm",
}: {
  email: string;
  type?: "confirm" | "reset";
}): string => {
  return `otp::${type}::${email.toLowerCase()}`;
};

class RedisService {
  set = async (
    keyOrOptions: string | IRedisSetOptions,
    valueParam?: string | number | object,
    ttlParam?: number,
  ): Promise<string | null> => {
    let key: string;
    let value: string | number | object;
    let ttl: number | undefined;

    if (typeof keyOrOptions === "object" && keyOrOptions !== null) {
      key = keyOrOptions.key;
      value = keyOrOptions.value;
      ttl = keyOrOptions.ttl;
    } else {
      key = keyOrOptions;
      value = valueParam!;
      ttl = ttlParam;
    }

    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if (ttl && ttl > 0) {
      return await redisClient.set(key, stringValue, "EX", ttl);
    }
    return await redisClient.set(key, stringValue);
  };

  get = async (
    keyOrOptions: string | IRedisGetOptions,
  ): Promise<string | null> => {
    const key =
      typeof keyOrOptions === "object" && keyOrOptions !== null
        ? keyOrOptions.key
        : keyOrOptions;
    return await redisClient.get(key);
  };

  del = async (
    keyOrOptions: string | IRedisDelOptions,
  ): Promise<number> => {
    const key =
      typeof keyOrOptions === "object" && keyOrOptions !== null
        ? keyOrOptions.key
        : keyOrOptions;
    return await redisClient.del(key);
  };

  exists = async (key: string): Promise<number> => {
    return await redisClient.exists(key);
  };
}

export const redisService = new RedisService();

export const set = redisService.set;
export const get = redisService.get;
export const del = redisService.del;
export const exists = redisService.exists;

export default redisService;
