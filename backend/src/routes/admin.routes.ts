import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateOrderStatusSchema } from '../validations/order.validation';

const router = Router();

router.patch(
  '/orders/:id/status',
  authMiddleware,
  // isAdmin,
  validate(updateOrderStatusSchema),
  OrderController.updateOrderStatus as any
);

export default router;