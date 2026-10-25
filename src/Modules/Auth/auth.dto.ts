import { z } from "zod";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  loginWithGoogleSchema,
  resetPasswordSchema,
  signUpSchema,
} from "./auth.validation.js";

export type ISignUpDTO = z.infer<typeof signUpSchema.body>;

export type IConfirmEmailDTO = z.infer<typeof confirmEmailSchema.body>;

export type ILoginDTO = z.infer<typeof loginSchema.body>;

export type IForgetPasswordDTO = z.infer<typeof forgetPasswordSchema.body>;

export type IResetPasswordDTO = z.infer<typeof resetPasswordSchema.body>;

export type ILoginWithGoogleDTO = z.infer<typeof loginWithGoogleSchema.body>;
