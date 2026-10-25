import { z } from "zod";
import {
  CommentIdParamsSchema,
  createCommentSchema,
  createPostSchema,
  postIdParamsSchema,
  updateCommentSchema,
  updatePostSchema,
} from "./post.validation";

export type ICreatePostDTO = z.infer<typeof createPostSchema.body>;
export type IPostIdParamsDTO = z.infer<typeof postIdParamsSchema.params>;
export type IUpdatePostDTO = z.infer<typeof updatePostSchema.body>;

export type ICreateCommentDTO = z.infer<typeof createCommentSchema.body>;
export type IUpdateCommentDTO = z.infer<typeof updateCommentSchema.body>;
export type ICommentIdParamsDTO = z.infer<typeof CommentIdParamsSchema.params>;
