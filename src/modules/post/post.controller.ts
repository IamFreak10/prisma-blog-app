import { NextFunction, Request, Response } from 'express';
import { PostService } from './post.service';
import { PostStatus } from '../../../generated/prisma/enums';
import paginationHelper from '../../helpers/paginationSortingHelper';
import { UserRole } from '../../middlewares/auth';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: 'You are not authorized!' });
    const result = await PostService.createPost(req.body, req.user.id);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllposts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === 'string' ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === 'true'
      : false;
    const status = req.query.status as PostStatus;
    const authorId = req.query.authorId as string;
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const options = paginationHelper(req.query);
    console.log(options);
    const { page, limit, skip, sortBy, sortOrder } = options;
    const result = await PostService.getAllPosts(
      { search: searchString },
      tags,
      isFeatured,
      status,
      authorId,
      limit,
      skip,
      sortBy,
      sortOrder,
      page
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Post arent found',
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { PostId } = req.params;
    if (!PostId) {
      throw new Error('PostId not found');
    }
    const result = await PostService.getPostById(PostId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  console.log('HIT');
  try {
    const { PostId } = req.params;
    const authorId = req.user?.id;
    if (!PostId) {
      throw new Error('PostId not found');
    }
    const result = await PostService.deletePost(PostId as string);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Post arent found',
      details: error,
    });
  }
};

const getMyposts = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    const result = await PostService.getMyposts(id as string);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'Post arent found',
      details: error,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('You are unauthorized!');
    }

    const { PostId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await PostService.updatePost(
      PostId as string,
      req.body,
      user.id,
      isAdmin
    );
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Post update failed!';
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getStats();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
};

export const PostController = {
  createPost,
  getAllposts,
  getPostById,
  deletePost,
  getMyposts,
  updatePost,
  getStats,
};
