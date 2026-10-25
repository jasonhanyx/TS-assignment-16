import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import {
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/cloud.multer.js";
import { validation } from "../../Middlewares/validation.middleware";
import * as validators from "./post.validation";
import postService from "./post.service.js";

const router = Router();

router.use(authentication());

router.post(
  "/",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.createPostSchema),
  postService.createPost,
);

router.get(
  "/:postId",
  validation(validators.postIdParamsSchema),
  postService.getSpecificPost,
);
router.get(
  "/",
  validation(validators.postIdParamsSchema),
  postService.getAllPosts,
);

router.patch(
  "/:postId/like",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.postIdParamsSchema),
  postService.toggleLikePost,
);

router.patch(
  "/:postId/update",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.updatePostSchema),
  postService.updatePost,
);

router.delete(
  "/:postId/delete",
  localFileUpload({ validation: fileValidation.images, folder: "posts" }).array(
    "attachments",
    20,
  ),
  validation(validators.postIdParamsSchema),
  postService.deletePost,
);

router.post(
  "/:postId/comment",
  validation(validators.createCommentSchema),
  postService.createComments,
);

router.patch(
  "/comment/:commentId",
  validation(validators.updateCommentSchema),
  postService.updateComment,
);

router.delete(
  "/comment/:commentId",
  validation(validators.CommentIdParamsSchema),
  postService.deleteComment,
);

export default router;
