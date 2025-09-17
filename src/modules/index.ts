import { Router } from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './users/user.route';
import problemRoutes from './problems/problem.route';
import submissionRoutes from './submissions/submission.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/problems', route: problemRoutes },
  { path: '/submissions', route: submissionRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
