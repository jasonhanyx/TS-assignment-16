import type { ZodError, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../Utils/response/error.response.js";

type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{ message: string; path: (string | number | symbol)[] }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      const KeySchema = schema[key];
      if (!KeySchema) continue;

      const validationResults = KeySchema.safeParse(req[key]);
      if (!validationResults.success) {
        const zodError = validationResults.error as ZodError;
        validationErrors.push({
          key,
          issues: zodError.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        });
      }
      continue;
    }
    if (validationErrors.length > 0) {
      throw new BadRequestException("validation Error", {
        cause: validationErrors,
      });
    }
    next();
  };
};
