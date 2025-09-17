import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import * as submissionService from './submission.service';
import AppError from '@/utils/AppError';

export const createSubmission = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Authentication error', StatusCodes.UNAUTHORIZED);
  
  const submission = await submissionService.createSubmission(req.body, req.user.id);
  res.status(StatusCodes.ACCEPTED).json({ success: true, data: submission });
});

export const getSubmission = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Authentication error', StatusCodes.UNAUTHORIZED);

  const submission = await submissionService.getSubmissionById(req.params.id, req.user.id);
  res.status(StatusCodes.OK).json({ success: true, data: submission });
});

export const getUserSubmissions = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Authentication error', StatusCodes.UNAUTHORIZED);

  const submissions = await submissionService.getSubmissionsForUser(req.user.id, req.query);
  res.status(StatusCodes.OK).json({ success: true, data: submissions });
});
