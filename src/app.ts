import express, { Application, Express, Request, Response, NextFunction } from 'express';

import { router } from './router';

const app: Application = express();
const port = 3000;

app.use(router);

app.use((error, req: Request, res: Response, next: NextFunction) =>
  res.status(error.statusCode || 500).send(error.message?.toString() ?? 'Internal Server Error'),
);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});
