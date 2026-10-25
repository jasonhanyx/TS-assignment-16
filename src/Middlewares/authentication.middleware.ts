import { NextFunction, Request, Response } from "express";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/security/token.js";
import { HUserDocument, UserModel } from "../DB/Models/user.model.js";
import {
  RoleEnum,
  SignatureEnum,
  TokenTypeEnum,
} from "../Utils/enums/usermenum.js";
import { get, revokeTokenKey } from "../DB/redis.service.js";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: HUserDocument;
      decoded?: JwtPayload;
    }
  }
}

export const decodedToken = async ({
  authorization,
  tokenType = TokenTypeEnum.Access,
}: {
  authorization?: string | undefined;
  tokenType?: TokenTypeEnum | undefined;
}): Promise<{ user: HUserDocument; decoded: JwtPayload }> => {
  if (!authorization) {
    throw new UnauthorizedException("Authorization header is required");
  }

  const [Bearer, token] = authorization.split(" ") || [];
  if (!Bearer || !token) {
    throw new BadRequestException("Invalid token format");
  }

  const normalizedBearer = Bearer.toUpperCase();
  const signature = await getSignature({
    signatureLevel:
      normalizedBearer === "ADMIN"
        ? SignatureEnum.Admin
        : normalizedBearer === "USER" || normalizedBearer === "BEARER"
          ? SignatureEnum.User
          : new Error("Invalid Signature"),
  });

  let decoded: JwtPayload;
  try {
    decoded = verifyToken({
      token,
      secretKey:
        tokenType === TokenTypeEnum.Access
          ? signature.accessSignature
          : signature.refreshSignature,
    }) as JwtPayload;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Invalid or expired token";
    throw new UnauthorizedException(message);
  }

  const userId = decoded.id || decoded._id;
  if (!userId) {
    throw new UnauthorizedException("Invalid token payload");
  }

  const isRevoked = await get({
    key: revokeTokenKey({ userId, jti: decoded.jti }),
  });
  if (isRevoked) {
    throw new UnauthorizedException("Token is Revoked");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("user not found");
  }

  if (user.changeCredentialsTime && decoded.iat) {
    if (Math.floor(user.changeCredentialsTime.getTime() / 1000) > decoded.iat) {
      throw new UnauthorizedException("Token is Expired");
    }
  }

  return { user, decoded };
};

export const authentication = ({
  tokenType = TokenTypeEnum.Access,
}: { tokenType?: TokenTypeEnum } = {}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { user, decoded } =
      (await decodedToken({
        authorization: req.headers.authorization,
        tokenType,
      })) || {};
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = (
  options: { accessRoles?: RoleEnum[] } | RoleEnum[] = {},
) => {
  const accessRoles = Array.isArray(options)
    ? options
    : options.accessRoles || [];

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user || !accessRoles.includes(req.user.role as RoleEnum)) {
        throw new ForbiddenException("Unauthorized Access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
