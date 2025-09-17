import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, Role } from '@prisma/client';
import config from '../config';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', StatusCodes.UNAUTHORIZED));
  }

  const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

  const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', StatusCodes.UNAUTHORIZED));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', StatusCodes.FORBIDDEN));
    }
    next();
  };
};
