import console from 'node:console';
import { Post, PostStatus } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { PostWhereInput } from '../../../generated/prisma/models';

const createPost = async (
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (
  payload: { search: string | undefined },
  tags: string[],
  isFeatured: boolean,
  status: PostStatus,
  authorId: string,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string,
  page: number
) => {
  const searchMethod: PostWhereInput[] = [];
  if (payload.search) {
    searchMethod.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    searchMethod.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (isFeatured) {
    searchMethod.push({
      isFeatured: true,
    });
  }

  if (status) {
    searchMethod.push({
      status,
    });
  }
  if (authorId) {
    searchMethod.push({
      authorId,
    });
  }
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: searchMethod,
    },
    orderBy: {
      //computed property names createdAt:asc
      [sortBy]: sortOrder,
    },
    include: {
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: searchMethod,
    },
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (PostId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: PostId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: PostId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            replies: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });
    return postData;
  });
};

const deletePost = async (PostId: string) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: PostId,
      // authorId,
    },
  });

  if (!postData) {
    throw new Error('You are not authorized to delete this post');
  }
  return await prisma.post.delete({
    where: {
      id: PostId,
    },
  });
};
export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
};
