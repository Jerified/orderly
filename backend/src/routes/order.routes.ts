import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema } from '../validations/order.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.post('/', validate(createOrderSchema), OrderController.createOrder as any    );
router.get('/', OrderController.getMyOrders as any);
router.get('/:id', OrderController.getOrderDetails as any);

export default router;