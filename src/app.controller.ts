import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/config.service";
import { corsOptions } from "./Utils/cors/cors";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import {
  globalErrorHandler,
  NotFoundException,
} from "./Utils/response/error.response";
import { authController, postController } from "./Modules/index.js";
import connectDB from "./DB/connection";
import { connectRedis } from "./DB/redis.connection.js";
import { userController } from "./Modules/User/index.js";

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const bootstrap = async (): Promise<void> => {
  const app: Express = express();
  app.use(helmet(), limiter, cors(corsOptions));
  app.use(express.json());
  await connectDB();
  await connectRedis();

  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: `Welcome to ${env.APPLICATION_NAME}` });
  });

  app.use("/api/v1/auth", authController);
  app.use("/api/v1/post", postController);
  app.use("/api/v1/user", userController);

  app.use((req: Request, res: Response) => {
    throw new NotFoundException("Route Not Found");
  });

  app.use(globalErrorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
};
