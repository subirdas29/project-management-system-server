import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import router from './app/routes';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    
    origin: 'http://localhost:3000',
    
    credentials: true,
  }),
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server Live',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
