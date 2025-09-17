import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/AppError';
import config from '../../config';

const prisma = new PrismaClient();

const signToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = newUser;
  const token = signToken(newUser.id);

  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, pass: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(pass, user.password))) {
    throw new AppError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
  }

  const { password, ...userWithoutPassword } = user;
  const token = signToken(user.id);

  return { user: userWithoutPassword, token };
};
