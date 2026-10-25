import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve("./config/dev.env") });

export const env = {
  //App
  PORT: Number(process.env.PORT) || 3000,
  MODE: process.env.MODE || "DEVELOPMENT",
  APPLICATION_NAME: process.env.APPLICATION_NAME || "Social App",

  //Database
  MONGODB_URI: process.env.MONGODB_URI as string,

  SALT: process.env.SALT || 12,

  //email
  EMAIL_USERNAME: process.env.EMAIL_USERNAME as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,

  //jwt
  ACCESS_USER_SIGNATURE: process.env.ACCESS_USER_SIGNATURE as string,
  ACCESS_ADMIN_SIGNATURE: process.env.ACCESS_ADMIN_SIGNATURE as string,
  REFRESH_USER_SIGNATURE: process.env.REFRESH_USER_SIGNATURE as string,
  REFRESH_ADMIN_SIGNATURE: process.env.REFRESH_ADMIN_SIGNATURE as string,
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 3600, //1 hour
  REFRESH_TOKEN_EXPIRES_IN:
    Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 604800, //7 days

  //encryption (aes-256-cbc needs exactly 32 characters)
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY as string,

  //whitelist
  WHITELIST: process.env.WHITELIST as string,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,

  // Redis
  REDIS_URI: process.env.REDIS_URI || "redis://127.0.0.1:6379",
};

export type Env = typeof env;
