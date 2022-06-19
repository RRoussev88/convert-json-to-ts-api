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

export const ENDPOINT_DESCRIPTION =
  'Use the POST version of this endpoint to convert JSON payload to TypeScript';

export const POST_VALID_JSON = 'POST some valid JSON';

export const normalizeInvalidTypeName = (name: string): string => {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return name;
  } else {
    const noSymbolsName = name.replace(/[^a-zA-Z0-9_$]/g, '_');
    const hasValidStart = /^[a-zA-Z_$]/.test(noSymbolsName);
    return hasValidStart ? noSymbolsName : `_${noSymbolsName}`;
  }
}

export const uniqueByIncrement = (name: string, index: number, namesArr: string[]): string => {
  if (!namesArr.length || !index || Array.of(new Set(namesArr)).length === namesArr.length) {
    return name;
  }
  const occurrences = namesArr.slice(0, index).filter(nam => nam === name).length;
  if (occurrences) {
    return `${name}_${occurrences + 1}`;
  }
  return name;
}

export const falsyValues = ['0', 'false', 'f', 'no', 'n']
