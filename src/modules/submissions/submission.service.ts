import { PrismaClient, Submission } from '@prisma/client';
import AppError from '../../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { executeCode } from '../judge/judge.service';

const prisma = new PrismaClient();

export const createSubmission = async (data: Omit<Submission, 'id' | 'userId' | 'createdAt' | 'status' | 'output'>, userId: string) => {
  const problem = await prisma.problem.findUnique({ where: { id: data.problemId } });
  if (!problem) {
    throw new AppError('Problem not found', StatusCodes.NOT_FOUND);
  }

  const submission = await prisma.submission.create({
    data: {
      ...data,
      userId,
      status: 'PENDING',
    },
  });

  // Asynchronously execute the code, don't await it here
  executeCode(submission.id);

  return { id: submission.id, status: submission.status };
};

export const getSubmissionById = async (id: string, userId: string) => {
  const submission = await prisma.submission.findUnique({ where: { id } });
  
  if (!submission) {
    throw new AppError('Submission not found', StatusCodes.NOT_FOUND);
  }

  if (submission.userId !== userId) {
     throw new AppError('You are not authorized to view this submission', StatusCodes.FORBIDDEN);
  }

  return submission;
};

export const getSubmissionsForUser = async (userId: string, filters: any) => {
  // TODO: Add filtering by problemId
  return prisma.submission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { 
      id: true, 
      status: true, 
      language: true, 
      createdAt: true, 
      problem: { select: { title: true, slug: true } }
    },
  });
};
