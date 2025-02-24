import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './app/middleware/ErrorHandler';

const app: Application = express();

//morgan logger in development for concise, colored logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  CORS for all origins
app.use(cors());

// Parsers for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route serving a status page
app.get('/', (_req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'views', 'status.html');
  res.sendFile(filePath);
});

// TODO: Add API routes (e.g., user, agent, transactions)
// app.use('/api/v1/users', userRoutes);

// Custom error handling middleware (should be registered after routes)
app.use(errorHandler);

// Fallback error handler for any unhandled errors
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
