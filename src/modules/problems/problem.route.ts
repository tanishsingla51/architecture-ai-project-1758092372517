import { Router } from 'express';
import { createProblem, deleteProblem, getProblemBySlug, getProblems, updateProblem } from './problem.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createProblemSchema, updateProblemSchema } from './problem.validation';

const router = Router();

router.route('/')
  .get(getProblems)
  .post(protect, restrictTo('ADMIN'), validate(createProblemSchema), createProblem);

router.route('/:slug')
  .get(getProblemBySlug)
  .patch(protect, restrictTo('ADMIN'), validate(updateProblemSchema), updateProblem)
  .delete(protect, restrictTo('ADMIN'), deleteProblem);

export default router;
