import { RequestHandler } from 'express';
import JsonToTS from 'json-to-ts';

export const convert: RequestHandler = (req, _, next) => {
  const interfaces = JsonToTS(req.body, { rootName: req.query.rootName?.toString() }).map((inter) => {
    const firstBrace = inter.indexOf('{');
    return inter.slice(0, firstBrace) + inter.slice(firstBrace).replace(/(\r\n|\n|\r|\s)/gm, '');
  });
  req.body = { interfaces };
  next();
};

export const POST_VALID_JSON = 'POST some valid JSON';
