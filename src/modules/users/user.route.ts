import { Router } from 'express';
import { getMe, getUser } from './user.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/me', getMe);

router.use(restrictTo('ADMIN'));

router.get('/:id', getUser);

export default router;
