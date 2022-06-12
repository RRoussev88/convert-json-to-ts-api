import { Router, Request, Response, NextFunction } from 'express';
import JsonToTS from 'json-to-ts';

export const router: Router = Router();

router
  .route('/interface')
  .get((req: Request, res: Response, next: NextFunction) => {
    res.end(
      'Use the POST version of this endpoint to convert JSON payload to TypeScript interface definitions.',
    );
  })
  .post((req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      const interfaces = JsonToTS(req.body, { rootName: req.query.rootName.toString() }).map((inter) => {
        const firstBrace = inter.indexOf('{');
        return inter.slice(0, firstBrace) + inter.slice(firstBrace).replace(/(\r\n|\n|\r|\s)/gm, '');
      });
      res.json({ interfaces });
    } else {
      res.end('POST some valid JSON');
    }
  });
