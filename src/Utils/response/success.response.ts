import { Response } from "express";

export interface ISuccessResponse<T = unknown> {
  res: Response;
  message?: string;
  data?: T;
  statusCode?: number;
}

export const successResponse = <T = unknown>({
  res,
  message = "Done",
  data,
  statusCode = 200,
}: ISuccessResponse<T>): Response => {
  return res.status(statusCode).json({
    message,
    ...(data !== undefined && { data }),
  });
};
