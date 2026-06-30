import express, { Router } from 'express';
import { CommentController } from './comment.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
router.get('/author/:authorId', CommentController.getCommentsByAuthorId);
router.get('/:commentId', CommentController.getCommentById);
router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment
);

router.delete(
  '/:commentId',
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment
);

router.patch(
  '/:commentId',
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.updateComment
);

router.patch(
  '/moderate/:commentId',
  auth(UserRole.ADMIN),
  CommentController.moderateComment
);
export const commentRouter: Router = router;
