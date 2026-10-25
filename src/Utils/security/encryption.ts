import crypto from "node:crypto";
import { env } from "./../../config/config.service";

const IV_LENGTH = 16;

const ENCRYPTION_KEY: Buffer = Buffer.from(env.ENCRYPTION_SECRET_KEY, "utf-8");

export const encrypt = (text: string): string => {
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encryptedData: string = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decrypt = (encryptedData: string): string => {
  const [ivHex, encryptedText] = encryptedData.split(":");

  if (!ivHex || !encryptedText) {
    throw new Error("Invalid encrypted data format");
  }

  const iv: Buffer = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decryptedData: string = decipher.update(encryptedText, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
};
