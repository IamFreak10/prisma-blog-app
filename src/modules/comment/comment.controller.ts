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

export const CommentController = {
  createComment,
};
