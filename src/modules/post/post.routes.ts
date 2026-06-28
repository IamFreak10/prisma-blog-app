import express, { Router } from 'express';
import { PostController } from './post.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
router.get('/', PostController.getAllposts);
router.get('/:PostId', PostController.getPostById);
router.post('/', auth(UserRole.USER), PostController.createPost);

router.delete('/:PostId', auth(UserRole.USER), PostController.deletePost);
export const postRoutes: Router = router;
