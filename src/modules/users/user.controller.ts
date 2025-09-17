import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { findUserById } from './user.service';
import AppError from '@/utils/AppError';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not found on request', StatusCodes.UNAUTHORIZED);
  }
  
  const user = await findUserById(req.user.id);
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await findUserById(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});
