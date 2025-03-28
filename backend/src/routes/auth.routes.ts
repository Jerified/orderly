import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, loginUserSchema } from '../validations/user.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(createUserSchema), AuthController.register);
router.post('/login', validate(loginUserSchema), AuthController.login);
// router.get('/me', authMiddleware, AuthController.getMe);

export default router;