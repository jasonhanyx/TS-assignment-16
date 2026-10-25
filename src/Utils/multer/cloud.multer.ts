import { Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../response/error.response.js";

export const fileValidation = {
  images: ["image/png", "image/jpg", "image/gif"],
  videos: ["video/mp4", "video/mpeg", "video/jpeg", "video/mj2"],
  documents: ["application/pdf"],
};

export const uploadDir = resolve("./uploads");

export const localFileUpload = ({
  validation = fileValidation.images,
  maxSizeMB = 5,
  folder = "general",
}: {
  validation?: string[];
  maxSizeMB?: number;
  folder?: string;
} = {}) => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const desPath = resolve(uploadDir, folder);
      if (!existsSync(desPath)) {
        mkdirSync(desPath, { recursive: true });
      }
      cb(null, desPath);
    },
    filename: (req: Request, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}_${randomUUID()}.${ext}`);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new BadRequestException(`Invalid file foramt: ${file.mimetype}`),
      );
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
