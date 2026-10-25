import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

export interface IFriendRequest {
  _id: Types.ObjectId;
  sendBy: Types.ObjectId;
  sendTo: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export const friendRequestSchema = new Schema<IFriendRequest>(
  {
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

friendRequestSchema.index({ sendBy: 1, sendTo: -1 });

// postSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "postId",
// });

export const FriendRequestModel: Model<IFriendRequest> = model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema,
);

export type HFriendRequestDocument = HydratedDocument<IFriendRequest>;
