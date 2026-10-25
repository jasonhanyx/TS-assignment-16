import { z } from "zod";

export const loginSchema = {
  body: z.strictObject({
    email: z.email(),
    password: z
      .string({ error: "password must be required" })
      .min(8, { error: "password must be at least 8 character" })
      .max(64, { error: "password must be at most 64 character" }),
  }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.email(),
    otp: z.string().regex(/^\d{6}$/),
  }),
};

export const signUpSchema = {
  body: loginSchema.body
    .extend({
      username: z
        .string({ error: "username must be required" })
        .min(2, { error: "username must be at least 2 character" })
        .max(25, { error: "username must be at most 25 character" }),
      confirmPassword: z
        .string({ error: "confirmPassword must be required" })
        .min(8, { error: "confirmPassword must be at least 8 character" })
        .max(64, { error: "confirmPassword must be at most 64 character" }),
      phone: z
        .string({ error: "phone must be required" })
        .min(10, { error: "phone must be at least 10 character" })
        .max(15, { error: "phone must be at most 15 character" }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Password missmatch",
        });
      }
    }),
};

export const forgetPasswordSchema = {
  body: z.strictObject({
    email: z.email(),
  }),
};

export const resetPasswordSchema = {
  body: z
    .strictObject({
      email: z.email(),
      newPassword: z
        .string({ error: "newPassword must be required" })
        .min(8, { error: "newPassword must be at least 8 character" })
        .max(64, { error: "newPassword must be at most 64 character" }),
      confirmPassword: z
        .string({ error: "confirmPassword must be required" })
        .min(8, { error: "confirmPassword must be at least 8 character" })
        .max(64, { error: "confirmPassword must be at most 64 character" }),
      otp: z.string().regex(/^\d{6}$/),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }),
};

export const loginWithGoogleSchema = {
  body: z.strictObject({
    idToken: z.string().min(1, { error: "idToken is required" }),
  }),
};
