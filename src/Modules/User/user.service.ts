import { Request, Response } from "express";
import { IRequestIdParamsDTO, IUserIdParamsDTO } from "./user.dto.js";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "./../../Utils/response/error.response";
import { UserModel } from "./../../DB/Models/user.model";
import { FriendRequestModel } from "./../../DB/Models/friendRequest.model";

class UserService {
  constructor() {}

  sendFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as { userId: string };
    const senderId = req.user!._id;

    if (userId === senderId.toString())
      throw new BadRequestException("you cannot add yourself");

    const targrt = await UserModel.findById(userId);
    if (!targrt) throw new NotFoundException("User not found");

    if (
      targrt.blockedUsers?.some((id) => id.equals(senderId)) ||
      req.user!.blockedUsers?.some((id) => id.equals(targrt._id))
    )
      throw new ForbiddenException("Cannot send reqest to this user");

    if (targrt.friends?.some((id) => id.equals(senderId)))
      throw new ConflictException("You are already exists");

    const existing = await FriendRequestModel.findOne({
      $or: [
        { sendBy: senderId, sendTo: userId },
        { sendBy: userId, sendTo: senderId },
      ],
    });

    if (existing) throw new ConflictException("friend request already exists");

    const friendRequest = await FriendRequestModel.create({
      sendBy: senderId,
      sendTo: userId,
    });

    return res
      .status(201)
      .json({ message: "Friend Request sent ", data: { friendRequest } });
  };

  listFriendRequests = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const friendRequest = await FriendRequestModel.find({
      sendTo: req.user!._id,
    })
      .populate("sendBy", "firstName lastName email - _id")
      .lean();

    return res.status(200).json({ message: "Done ", data: { friendRequest } });
  };

  acceptFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };
    const friendRequest = await FriendRequestModel.findOne({
      _id: requestId,
      sendTo: req.user!._id,
    });
    if (!friendRequest) throw new NotFoundException("Friend request not found");

    await Promise.all([
      UserModel.updateOne(
        { _id: friendRequest.sendBy },
        { $addToSet: { friends: friendRequest.sendTo } },
      ),
      UserModel.updateOne(
        { _id: friendRequest.sendTo },
        { $addToSet: { friends: friendRequest.sendBy } },
      ),
    ]);

    await FriendRequestModel.deleteOne({ _id: requestId });

    return res.status(200).json({ message: "Friend request accepted " });
  };

  rejectFriendRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { requestId }: IRequestIdParamsDTO = req.params as {
      requestId: string;
    };
    const friendRequest = await FriendRequestModel.findOneAndDelete({
      _id: requestId,
      $or: [{ sendTo: req.user!._id }, { sendBy: req.user!._id }],
    });
    if (!friendRequest) throw new NotFoundException("Friend request not found");

    return res.status(200).json({ message: "Friend request rejected " });
  };

  removeFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    await Promise.all([
      UserModel.updateOne({ _id: myId }, { $pull: { friends: userId } }),
      UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
    ]);

    return res.status(200).json({ message: "Friend removed successfully " });
  };

  blockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };
    const myId = req.user!._id;

    if (userId === myId.toString())
      throw new BadRequestException("you cannot block yourself");

    const target = await UserModel.findById(userId);
    if (!target) throw new NotFoundException("User not found");

    await Promise.all([
      UserModel.updateOne(
        { _id: myId },
        { $addToSet: { blockedUsers: userId }, $pull: { friends: userId } },
      ),
      UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
      FriendRequestModel.deleteMany({
        $or: [
          { sendBy: myId, sendTo: userId },
          { sendBy: userId, sendTo: myId },
        ],
      }),
    ]);

    return res.status(200).json({ message: "User blocked successfully " });
  };

  unBlockUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IUserIdParamsDTO = req.params as {
      userId: string;
    };

    const updated = await UserModel.updateOne(
      { _id: req.user!._id },
      { $pull: { blockedUsers: userId } },
    );
    if (!updated)
      throw new BadRequestException("User not found or invaild unblocked user");

    return res.status(200).json({ message: "User unblocked successfully " });
  };
}

export default new UserService();
