import { randomInt } from "node:crypto";

export const generateOTP = (): string => {
  return String(randomInt(100000, 1000000));
};
