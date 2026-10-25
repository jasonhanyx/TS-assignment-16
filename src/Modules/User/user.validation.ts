import { z } from "zod";

export const userIdParamsSchema = {
  params: z.strictObject({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid userId format" }),
  }),
};

export const requestIdParamsSchema = {
  params: z.strictObject({
    requestId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid requestId format" }),
  }),
};
