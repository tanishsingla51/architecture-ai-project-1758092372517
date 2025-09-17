import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError';
import config from '../config';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (!(error instanceof AppError)) {
    error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    error.message = error.message || 'Something went wrong';
  }

  const response = {
    success: false,
    message: error.message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack, error: err }),
  };

  res.status(error.statusCode).json(response);
};
