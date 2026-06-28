import { Request, Response } from 'express';
import { CommentService } from './comment.service';

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Comment creation Failed',
      details: error,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Comment creation Failed',
      details: error,
    });
  }
};
const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentsByAuthorId(
      authorId as string
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Comment creation Failed',
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const user = req.user;
  const { commentId } = req.params;

  try {
    const result = await CommentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Comment deletion Failed',
      details: error,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteComment,
};
