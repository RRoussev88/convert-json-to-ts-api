import { Router, Request, Response } from 'express';

import {
  convertToTsString,
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
  .post((req: Request, res: Response) => {
    if (req.body) {
      res.json({
        interfaces: convertToTsString(req.body, req.query.rootName?.toString()).reduce(
          (acc, curr, index) => `${acc}${index ? ' ' : ''}${curr}`,
          '',
        ),
      });
    } else {
      res.end(POST_VALID_JSON);
    }
  });

router
  .route('/type')
  .get((_: Request, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} type definitions.`))
  .post((req: Request, res: Response) => {
    if (req.body) {
      res.json({
        types: convertToTsString(req.body, req.query.rootName?.toString())
          .map((inter) => {
            const firstBrace = inter.indexOf('{');
            return (
              inter.slice(0, firstBrace - 1).replace('interface', 'type') + ' = ' + inter.slice(firstBrace)
            );
          })
          .reduce((acc, curr, index) => `${acc}${index ? ' ' : ''}${curr}`, ''),
      });
    } else {
      res.end(POST_VALID_JSON);
    }
  });

router
  .route('/function')
  .get((_: Request, res: Response) => res.end(`${ENDPOINT_DESCRIPTION} function definition.`))
  .post((req: Request<{}, { func: string }, { args: any; returnType: any }>, res: Response) => {
    const { args, returnType } = req.body;
    let func = '() => void';
    let auxTypes;
    if (args) {
    }
    if (returnType) {
      const convertedReturnType = convertToTsString(returnType);
      if (convertedReturnType.length && convertedReturnType[0].length > 21) {
        func = func.replace('void', convertedReturnType[0].slice(21));
      }
      if (convertedReturnType.length > 1) {
        auxTypes = convertedReturnType
          .slice(1)
          .reduce((acc, curr, index) => `${acc}${index ? ' ' : ''}${curr}`, '');
      }
    }
    res.json({ func, auxTypes });
  });

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
