import { Router } from 'express';
import { register, login } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
