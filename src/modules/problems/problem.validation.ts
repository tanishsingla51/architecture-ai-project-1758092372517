import { z } from 'zod';
import { Difficulty } from '@prisma/client';

const difficultyEnum = z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]);

export const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
    description: z.string().min(1),
    difficulty: difficultyEnum,
  }),
});

export const updateProblemSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional(),
    description: z.string().min(1).optional(),
    difficulty: difficultyEnum.optional(),
  }),
});
