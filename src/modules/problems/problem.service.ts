import { PrismaClient, Problem } from '@prisma/client';
import AppError from '../../utils/AppError';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const queryProblems = async (filters: any) => {
  // TODO: Implement proper filtering and pagination
  return prisma.problem.findMany({
    select: { id: true, title: true, slug: true, difficulty: true },
  });
};

export const findProblemBySlug = async (slug: string) => {
  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: { testCases: { select: { id: true, input: true } } }, // only send input to user
  });
  if (!problem) {
    throw new AppError('Problem not found', StatusCodes.NOT_FOUND);
  }
  return problem;
};

export const createProblem = async (data: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.problem.create({ data });
};

export const updateProblem = async (slug: string, data: Partial<Problem>) => {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) {
    throw new AppError('Problem not found', StatusCodes.NOT_FOUND);
  }
  return prisma.problem.update({ where: { slug }, data });
};

export const deleteProblem = async (slug: string) => {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) {
    throw new AppError('Problem not found', StatusCodes.NOT_FOUND);
  }
  await prisma.problem.delete({ where: { slug } });
};
