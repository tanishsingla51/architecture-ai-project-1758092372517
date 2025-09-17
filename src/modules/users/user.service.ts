import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/AppError';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return user;
};
