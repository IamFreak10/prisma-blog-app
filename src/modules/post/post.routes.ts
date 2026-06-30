import express, { Router } from 'express';
import { PostController } from './post.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
router.get('/', PostController.getAllposts);
router.get(
  '/myposts',
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyposts
);
router.get('/:PostId', PostController.getPostById);

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);

router.patch(
  '/:PostId',
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost
);

router.delete('/:PostId', auth(UserRole.USER), PostController.deletePost);
export const postRoutes: Router = router;
