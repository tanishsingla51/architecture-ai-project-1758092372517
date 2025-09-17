import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    problemId: z.string().cuid('Invalid Problem ID'),
    code: z.string().min(1, 'Code cannot be empty'),
    language: z.string().min(1, 'Language is required'), // e.g., 'javascript', 'python'
  }),
});
