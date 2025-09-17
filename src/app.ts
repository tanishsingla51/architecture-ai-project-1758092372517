import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { globalErrorHandler } from './middleware/error.middleware';
import apiRoutes from './modules';
import AppError from './utils/AppError';

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('OK');
});

// API Routes
app.use('/api/v1', apiRoutes);

// Handle not found routes
app.all('*', (req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
