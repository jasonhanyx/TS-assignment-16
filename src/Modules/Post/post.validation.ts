import { z } from "zod";

export const createPostSchema = {
  body: z.strictObject({
    content: z.string().min(2).max(50000).optional(),
  }),
};

export const postIdParamsSchema = {
  params: z.strictObject({
    postId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid postId format" }),
  }),
};

export const updatePostSchema = {
  params: z.strictObject({
    postId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid postId format" }),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
  }),
};

export const createCommentSchema = {
  params: z.strictObject({
    postId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid postId format" }),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
    parentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid parentId format" })
      .optional(),
  }),
};

export const updateCommentSchema = {
  params: z.strictObject({
    commentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid commentId format" }),
  }),
  body: z.strictObject({
    content: z.string().min(2).max(50000),
  }),
};

export const CommentIdParamsSchema = {
  params: z.strictObject({
    commentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid commentId format" }),
  }),
};
