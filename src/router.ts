import { Router, Request, Response, NextFunction } from 'express';

export const router: Router = Router();

router.get('/type', (req: Request, res: Response, next: NextFunction) => {
  res.end('Type endpoint');
});
