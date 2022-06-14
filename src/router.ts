import { Router, Request, Response } from 'express';
import { isObject } from 'json-to-ts/build/src/util';
import { nextTick } from 'process';

import { convert, ENDPOINT_DESCRIPTION, POST_VALID_JSON } from './utils';

export const router: Router = Router();

router
  .route('/interface')
  .get((_, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} interface definitions.`))
  .post(convert, (req: Request, res: Response) => {
    if (req.body && isObject(req.body)) {
      res.json(req.body);
    } else {
      res.end(POST_VALID_JSON);
    }
  });

router
  .route('/type')
  .get((_: Request, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} type definitions.`))
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

router
  .route('/function')
  .get((_: Request, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} function definition.`));

router
  .route('/enum')
  .get((_: Request, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} enum definition.`))
  .post((req: Request<{}, {enum: string}, {array: string[]}>, res: Response, next) => {
    const { array } = req.body;
    if (array && Array.isArray(array)) {      
          res.json({ enum: `enum RootName {${array.reduce((acc, curr) => `${acc}${curr.toUpperCase()} = '${curr}', `, '')}}` });
    } else {
      res.status(400).end('POST a JSON object containing an `array` property as string array');
    }
  })
