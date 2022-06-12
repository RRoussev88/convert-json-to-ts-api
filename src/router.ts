import { Router, Request, Response } from 'express';
import { isObject } from 'json-to-ts/build/src/util';

import { convert, POST_VALID_JSON } from './utils';

export const router: Router = Router();

router
  .route('/interface')
  .get((_, res: Response) =>
    res.end(
      'Use the POST version of this endpoint to convert JSON payload to TypeScript interface definitions.',
    ),
  )
  .post(convert, (req: Request, res: Response) => {
    if (req.body && isObject(req.body)) {
      res.json(req.body)
    } else {
      res.end(POST_VALID_JSON);
    }
  });

router
  .route('/type')
  .get((_: Request, res: Response) =>
    res.end('Use the POST version of this endpoint to convert JSON payload to TypeScript type definitions.'),
  )
  .post(convert, (req: Request, res: Response) => {
    const { interfaces } = req.body;
    if (interfaces && Array.isArray(interfaces)) {
      const types = interfaces.map((inter) => {
        const firstBrace = inter.indexOf('{');
        return inter.slice(0, firstBrace - 1).replace('interface', 'type') + ' = ' + inter.slice(firstBrace);
      });

      res.json({ types });
    } else {
      res.end(POST_VALID_JSON);
    }
  });
