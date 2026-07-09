import { type Request, type Response, type NextFunction } from 'express';
import { Prisma } from '../../generated/prisma/client';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = 'You have incorrectly formatted your request';
  }
  res.status(statusCode).json({
    error: errorMessage,
    details: errorDetails,
  });
}
