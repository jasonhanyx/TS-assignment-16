import {
  decode,
  DecodeOptions,
  JwtPayload,
  Secret,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from "jsonwebtoken";
import { HUserDocument } from "../../DB/Models/user.model.js";
import { RoleEnum, SignatureEnum, TokenTypeEnum } from "../enums/usermenum.js";
import { env } from "../../config/config.service.js";
import { UnauthorizedException } from "../response/error.response.js";
import { randomUUID } from "node:crypto";

export const generatToken = ({
  payload,
  secret,
  options,
}: {
  payload: object;
  secret: Secret;
  options: SignOptions;
}) => {
  return sign(payload, secret, options);
};

export const verifyToken = ({
  token,
  secret,
  secretKey,
  options,
}: {
  token: string;
  secret?: Secret;
  secretKey?: Secret;
  options?: VerifyOptions;
}) => {
  const key = secretKey || secret;
  if (!key) {
    throw new Error("Secret key is required for verifyToken");
  }
  return verify(token, key, options);
};

export function decodeToken(
  token: string,
  options?: DecodeOptions,
): JwtPayload | string | null;
export function decodeToken(params: {
  token: string;
  options?: DecodeOptions;
}): JwtPayload | string | null;
export function decodeToken(
  tokenOrParams: string | { token: string; options?: DecodeOptions },
  options?: DecodeOptions,
): JwtPayload | string | null {
  if (typeof tokenOrParams === "string") {
    return decode(tokenOrParams, options);
  }
  return decode(tokenOrParams.token, tokenOrParams.options);
}

export interface ISignaturePair {
  accessSignature: string;
  refreshSignature: string;
}

export interface IGetSignatureOptions {
  signatureLevel?: SignatureEnum | Error;
  role?: RoleEnum | string | undefined;
  bearer?: string | undefined;
  tokenType?: TokenTypeEnum | "access" | "refresh" | string | undefined;
}

export function getSignature(params: {
  signatureLevel: SignatureEnum | Error;
}): Promise<ISignaturePair>;
export function getSignature(options: IGetSignatureOptions): string;
export function getSignature(
  roleOrBearer?: RoleEnum | string,
  tokenType?: TokenTypeEnum | "access" | "refresh" | string,
): string;
export function getSignature(
  paramOrOptions?: RoleEnum | string | IGetSignatureOptions,
  tokenTypeParam?: TokenTypeEnum | "access" | "refresh" | string,
): Promise<ISignaturePair> | string {
  if (typeof paramOrOptions === "object" && paramOrOptions !== null) {
    if (
      "signatureLevel" in paramOrOptions &&
      paramOrOptions.signatureLevel !== undefined
    ) {
      const level = paramOrOptions.signatureLevel;
      if (level instanceof Error) {
        throw new UnauthorizedException(level.message);
      }
      if (level === SignatureEnum.Admin) {
        return Promise.resolve({
          accessSignature: env.ACCESS_ADMIN_SIGNATURE,
          refreshSignature: env.REFRESH_ADMIN_SIGNATURE,
        });
      }
      return Promise.resolve({
        accessSignature: env.ACCESS_USER_SIGNATURE,
        refreshSignature: env.REFRESH_USER_SIGNATURE,
      });
    }

    const roleOrBearer = paramOrOptions.role || paramOrOptions.bearer;
    const tokenType = paramOrOptions.tokenType || "access";
    const normalized = (roleOrBearer || "").toLowerCase();
    const isAdmin = normalized === "admin" || roleOrBearer === RoleEnum.ADMIN;
    const isRefresh = (tokenType || "").toLowerCase() === "refresh";

    if (isAdmin) {
      return isRefresh
        ? env.REFRESH_ADMIN_SIGNATURE
        : env.ACCESS_ADMIN_SIGNATURE;
    }
    return isRefresh ? env.REFRESH_USER_SIGNATURE : env.ACCESS_USER_SIGNATURE;
  }

  const roleOrBearer = paramOrOptions;
  const tokenType = tokenTypeParam || "access";
  const normalized = (roleOrBearer || "").toLowerCase();
  const isAdmin = normalized === "admin" || roleOrBearer === RoleEnum.ADMIN;
  const isRefresh = (tokenType || "").toLowerCase() === "refresh";

  if (isAdmin) {
    return isRefresh ? env.REFRESH_ADMIN_SIGNATURE : env.ACCESS_ADMIN_SIGNATURE;
  }
  return isRefresh ? env.REFRESH_USER_SIGNATURE : env.ACCESS_USER_SIGNATURE;
}

export const createLogincredentials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const isAdmin = user.role === RoleEnum.ADMIN;

  const accessSecret = isAdmin
    ? env.ACCESS_ADMIN_SIGNATURE
    : env.ACCESS_USER_SIGNATURE;

  const refreshSecret = isAdmin
    ? env.REFRESH_ADMIN_SIGNATURE
    : env.REFRESH_USER_SIGNATURE;

  const accessJti = randomUUID();
  const refreshJti = randomUUID();

  const accessToken = generatToken({
    payload: { _id: user._id, id: user._id, jti: accessJti },
    secret: accessSecret,
    options: { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN, jwtid: accessJti },
  });

  const refreshToken = generatToken({
    payload: { _id: user._id, id: user._id, jti: refreshJti },
    secret: refreshSecret,
    options: { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN, jwtid: refreshJti },
  });
  return { accessToken, refreshToken };
};

export const getNewLoginCredentials = createLogincredentials;

export { revokeTokenKey, otpKey } from "../../DB/redis.service.js";

