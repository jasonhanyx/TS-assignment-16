import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";

import { validation } from "../../Middlewares/validation.middleware.js";
import * as validators from "./user.validation.js";
import userService from "./user.service.js";

const router = Router();

router.use(authentication());

router.post(
  "/friend-request/:userId",
  validation(validators.userIdParamsSchema),
  userService.sendFriendRequest,
);

router.get("/friend-request", userService.listFriendRequests);

router.patch(
  "/friend-request/:requestId/accept",
  validation(validators.requestIdParamsSchema),
  userService.acceptFriendRequest,
);

router.delete(
  "/friend-request/:requestId/reject",
  validation(validators.requestIdParamsSchema),
  userService.rejectFriendRequest,
);

router.delete(
  "/friend/:userId",
  validation(validators.userIdParamsSchema),
  userService.removeFriend,
);

router.patch(
  "/block/:userId",
  validation(validators.userIdParamsSchema),
  userService.blockUser,
);

router.patch(
  "/unblock/:userId",
  validation(validators.userIdParamsSchema),
  userService.unBlockUser,
);

export default router;
