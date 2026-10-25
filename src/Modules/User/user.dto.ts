import { z } from "zod";
import { requestIdParamsSchema, userIdParamsSchema } from "./user.validation";

export type IUserIdParamsDTO = z.infer<typeof userIdParamsSchema.params>;

export type IRequestIdParamsDTO = z.infer<typeof requestIdParamsSchema.params>;
