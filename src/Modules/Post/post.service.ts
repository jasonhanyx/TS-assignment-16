import { Request, Response } from "express";
import {
  ICommentIdParamsDTO,
  ICreateCommentDTO,
  ICreatePostDTO,
  IPostIdParamsDTO,
  IUpdateCommentDTO,
  IUpdatePostDTO,
} from "./post.dto.js";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "./../../Utils/response/error.response";
import { PostModel } from "./../../DB/Models/post.model";
import { CommentModel } from "./../../DB/Models/comment.model";

class PostService {
  constructor() {}

  createPost = async (req: Request, res: Response): Promise<Response> => {
    const { content }: ICreatePostDTO = req.body;

    const files = req.files as Express.Multer.File[] | undefined;

    if (!content && !files?.length) {
      throw new BadRequestException("Post must have content or attachments");
    }

    const post = await PostModel.create({
      ...(content && { content }),
      ...(files?.length && {
        attachments: files.map((file) => file.path),
      }),
      createdBy: req.user!._id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      data: { post },
    });
  };

  getSpecificPost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    })
      .populate("createdBy", "firstName lastName , email")
      .lean();

    if (!post) throw new NotFoundException("post not found");

    return res.status(200).json({
      message: "Post retrieved successfully",
      data: { post },
    });
  };

  getAllPosts = async (req: Request, res: Response): Promise<Response> => {
    const posts = await PostModel.find({ freezedAt: { $exists: false } })
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName , email");

    if (!posts || posts.length === 0)
      throw new NotFoundException("No posts found");

    return res.status(200).json({
      message: "Post retrieved successfully",
      data: { posts },
    });
  };
  toggleLikePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };

    const userId = req.user!._id;

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });

    if (!post) throw new NotFoundException("post not found");

    const alreadyLiked = post.likes?.some((id) => id.equals(userId));

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true },
    );

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      data: { updated },
    });
  };
  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };
    const { content }: IUpdatePostDTO = req.body;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId, createdBy: req.user!._id },
      { content, $inc: { _v: 1 } },
      { new: true },
    );

    if (!post)
      throw new ForbiddenException("Post not found or you are not author");

    return res.status(200).json({
      message: "Post updated Successfully",
      data: { post },
    });
  };

  deletePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };

    const post = await PostModel.findOneAndDelete({
      _id: postId,
      createdBy: req.user!._id,
    });

    if (!post)
      throw new ForbiddenException("Post not found or you are not author");

    return res.status(200).json({
      message: "Post deleted Successfully",
    });
  };

  createComments = async (req: Request, res: Response): Promise<Response> => {
    const { postId }: IPostIdParamsDTO = req.params as { postId: string };
    const { content, parentId }: ICreateCommentDTO = req.body;

    const post = await PostModel.findOne({
      _id: postId,
      freezedAt: { $exists: false },
    });
    if (!post) throw new NotFoundException("post not found");

    if (parentId) {
      const parent = await CommentModel.findOne({ _id: parentId, postId });
      if (!parent) throw new NotFoundException("Parent comment not found");
    }
    const comment = await CommentModel.create({
      postId,
      ...(parentId && { parentId }),
      content,
      createdBy: req.user!._id,
    });

    return res.status(201).json({
      message: "Comment created Successfully",
      data: { comment },
    });
  };

  updateComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId }: ICommentIdParamsDTO = req.params as {
      commentId: string;
    };
    const { content }: IUpdateCommentDTO = req.body;

    const comment = await CommentModel.findOneAndUpdate(
      { _id: commentId, createdBy: req.user!._id },
      { content },
      { new: true },
    );

    if (!comment)
      throw new ForbiddenException("Comment not found or you are not author");

    return res.status(200).json({
      message: "Comment updated successfully",
      data: { comment },
    });
  };
  deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId }: ICommentIdParamsDTO = req.params as {
      commentId: string;
    };

    const comment = await CommentModel.findById(commentId);

    if (!comment) throw new NotFoundException("Comment not found ");

    const post = await PostModel.findById(comment.postId);
    const isCommentAuthor = comment.createdBy.equals(req.user!._id);
    const isPostAuthor = post?.createdBy.equals(req.user!._id);

    if (!isCommentAuthor && !isPostAuthor) {
      throw new ForbiddenException(
        "You are not authorized to delete this comment",
      );
    }

    await Promise.all([
      CommentModel.deleteOne({ _id: commentId }),
      CommentModel.deleteMany({ parentId: commentId }),
    ]);

    return res.status(200).json({
      message: "Comment deleted Successfully",
    });
  };
}

export default new PostService();
