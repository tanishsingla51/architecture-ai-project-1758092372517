import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createSubmission, getSubmission, getUserSubmissions } from './submission.controller';
import { validate } from '../../middleware/validate.middleware';
import { createSubmissionSchema } from './submission.validation';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createSubmissionSchema), createSubmission)
  .get(getUserSubmissions);

router.route('/:id')
  .get(getSubmission);

export default router;
