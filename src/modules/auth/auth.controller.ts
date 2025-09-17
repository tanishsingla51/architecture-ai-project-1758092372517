import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { registerUser, loginUser } from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await registerUser(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body.email, req.body.password);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user,
      token,
    },
  });
});
