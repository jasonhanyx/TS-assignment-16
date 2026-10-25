import { HydratedDocument, model, Model, Schema, Types } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/usermenum.js";
import { generatHash } from "./../../Utils/security/hash";
import { encrypt } from "../../Utils/security/encryption";
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;

  email: string;
  confirmEmailOTP?: string;
  confirmAt?: Date;

  password: string;
  resetPasswordOTP?: string;

  phone: string;
  address?: string;
  profilePic?: string | undefined;

  gender?: GenderEnum;
  role?: RoleEnum;
  friends: Types.ObjectId[];
  blockedUsers?: Types.ObjectId[];
  provider?: ProviderEnum;

  changeCredentialsTime?: Date;

  createdAt: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    confirmEmailOTP: String,
    confirmAt: Date,
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === ProviderEnum.SYSTEM;
      },
    },
    resetPasswordOTP: String,
    phone: {
      type: String,
      required: true,
    },
    address: String,
    profilePic: String,
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },
    changeCredentialsTime: Date,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.confirmEmailOTP;
        delete ret.resetPasswordOTP;
        return ret;
      },
    },
  },
);

userSchema
  .virtual("username")
  .set(function (value: string) {
    const [firstName, ...rest] = value.trim().split(/\s+/);
    this.set({ firstName, lastName: rest.join(" ") });
  })
  .get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
  });

userSchema.pre("validate", function () {
  this.email = this.email.toLowerCase().trim();
});

userSchema.pre(
  "save",
  async function (this: HUserDocument & { wasNew: boolean }) {
    this.wasNew = this.isNew;
    if (this.isModified("phone")) {
      this.phone = await encrypt(this.phone);
    }
    if (this.isModified("password")) {
      this.password = await generatHash(this.password);
    }
  },
);


export const UserModel: Model<IUser> = model<IUser>("User", userSchema);

export type HUserDocument = HydratedDocument<IUser>;
