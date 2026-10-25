import { validation } from "../../Middlewares/validation.middleware.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import authService from "./auth.service";
import * as validators from "./auth.validation.js";
import { Router } from "express";

const router = Router();

router.post("/signup", validation(validators.signUpSchema), authService.signup);

router.post("/login", validation(validators.loginSchema), authService.login);

router.post("/logout", authentication(), authService.logout);

router.post(
  "/forget-password",
  validation(validators.forgetPasswordSchema),
  authService.forgetPassword,
);

router.patch(
  "/reset-password",
  validation(validators.resetPasswordSchema),
  authService.resetPassword,
);

router.post(
  "/google-login",
  validation(validators.loginWithGoogleSchema),
  authService.loginWithGoogle,
);

router.patch(
  "/confirm-email",
  validation(validators.confirmEmailSchema),
  authService.confirmEmail,
);

export default router;
