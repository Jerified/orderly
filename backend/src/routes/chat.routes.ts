import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { closeChatSchema } from '../validations/chat.validation';

const router = Router();

router.use(authMiddleware);

router.get('/:orderId/room', ChatController.getChatRoom as any);
router.get('/:orderId/messages', ChatController.getMessages as any);
router.post(
  '/:orderId/close',
  validate(closeChatSchema),
  ChatController.closeChatRoom as any
);

export default router;