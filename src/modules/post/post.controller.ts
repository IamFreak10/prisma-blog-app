import { Request, Response } from 'express';
import { PostService } from './post.service';
import { PostStatus } from '../../../generated/prisma/enums';
import paginationHelper from '../../helpers/paginationSortingHelper';

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: 'You are not authorized!' });
    const result = await PostService.createPost(req.body, req.user.id);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Post creation Failed',
      details: error,
    });
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
      sortOrder,page
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Post arent found',
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllposts,
};
