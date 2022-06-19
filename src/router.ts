import { Router, Request, Response } from 'express';
import { isObject } from 'json-to-ts/build/src/util';

import {
  convert,
  ENDPOINT_DESCRIPTION,
  falsyValues,
  normalizeInvalidTypeName,
  POST_VALID_JSON,
  uniqueByIncrement,
} from './utils';

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
  .post(
    (
      req: Request<
        {},
        { enum: string },
        string[],
        { rootName: string; useNumericValues: string; capitalize: string }
      >,
      res: Response,
    ) => {
      const payload = req.body;
      if (payload && Array.isArray(payload) && payload.every((val) => typeof val === 'string')) {
        const { rootName, useNumericValues, capitalize } = req.query;
        const normalizedPayload = payload.map((name) =>
          capitalize && !falsyValues.includes(capitalize)
            ? normalizeInvalidTypeName(name).toUpperCase()
            : normalizeInvalidTypeName(name),
        );
        const responsePayload = {
          enum: `enum ${rootName ? normalizeInvalidTypeName(rootName) : 'RootName'} `,
        };
        if (useNumericValues && !falsyValues.includes(useNumericValues)) {
          responsePayload.enum += `{${normalizedPayload.reduce(
            (acc, curr, index, arr) => `${acc}${uniqueByIncrement(curr, index, arr)}, `,
            '',
          )}}`;
        } else {
          responsePayload.enum += `{${normalizedPayload.reduce(
            (acc, curr, index, arr) => `${acc}${uniqueByIncrement(curr, index, arr)} = '${payload[index]}', `,
            '',
          )}}`;
        }
        res.json(responsePayload);
      } else {
        res.status(400).end('Invalid Payload. POST an array of strings.');
      }
    },
  );
