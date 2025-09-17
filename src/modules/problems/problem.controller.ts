import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import * as problemService from './problem.service';

export const getProblems = catchAsync(async (req: Request, res: Response) => {
  const problems = await problemService.queryProblems(req.query);
  res.status(StatusCodes.OK).json({ success: true, data: problems });
});

export const getProblemBySlug = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.findProblemBySlug(req.params.slug);
  res.status(StatusCodes.OK).json({ success: true, data: problem });
});

export const createProblem = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.createProblem(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: problem });
});

export const updateProblem = catchAsync(async (req: Request, res: Response) => {
  const problem = await problemService.updateProblem(req.params.slug, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: problem });
});

export const deleteProblem = catchAsync(async (req: Request, res: Response) => {
  await problemService.deleteProblem(req.params.slug);
  res.status(StatusCodes.NO_CONTENT).send();
});
