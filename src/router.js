"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const utils_1 = require("./utils");
exports.router = (0, express_1.Router)();
exports.router
    .route('/interface')
    .get((_, res) => res.end(`${utils_1.ENDPOINT_DESCRIPTION} interface definitions.`))
    .post((req, res) => {
    var _a;
    if (req.body) {
        res.json({
            interfaces: (0, utils_1.convertToTsString)(req.body, (_a = req.query.rootName) === null || _a === void 0 ? void 0 : _a.toString()).reduce((acc, curr, index) => `${acc}${index ? ' ' : ''}${curr}`, ''),
        });
    }
    else {
        res.end(utils_1.POST_VALID_JSON);
    }
});
exports.router
    .route('/type')
    .get((_, res) => res.end(`${utils_1.ENDPOINT_DESCRIPTION} type definitions.`))
    .post((req, res) => {
    var _a;
    if (req.body) {
        res.json({
            types: (0, utils_1.convertToTsString)(req.body, (_a = req.query.rootName) === null || _a === void 0 ? void 0 : _a.toString())
                .map((inter) => {
                const firstBrace = inter.indexOf('{');
                return (inter.slice(0, firstBrace - 1).replace('interface', 'type') + ' = ' + inter.slice(firstBrace));
            })
                .reduce((acc, curr, index) => `${acc}${index ? ' ' : ''}${curr}`, ''),
        });
    }
    else {
        res.end(utils_1.POST_VALID_JSON);
    }
});
exports.router
    .route('/enum')
    .get((_, res) => res.end(`${utils_1.ENDPOINT_DESCRIPTION} enum definition.`))
    .post((req, res) => {
    const payload = req.body;
    if (payload && Array.isArray(payload) && payload.every((val) => typeof val === 'string')) {
        const { rootName, useNumericValues, capitalize } = req.query;
        const normalizedPayload = payload.map((name) => capitalize && !utils_1.falsyValues.includes(capitalize)
            ? (0, utils_1.normalizeInvalidTypeName)(name).toUpperCase()
            : (0, utils_1.normalizeInvalidTypeName)(name));
        const responsePayload = {
            enum: `enum ${rootName ? (0, utils_1.normalizeInvalidTypeName)(rootName) : 'RootName'} `,
        };
        if (useNumericValues && !utils_1.falsyValues.includes(useNumericValues)) {
            responsePayload.enum += `{${normalizedPayload.reduce((acc, curr, index, arr) => `${acc}${(0, utils_1.uniqueByIncrement)(curr, index, arr)}, `, '')}}`;
        }
        else {
            responsePayload.enum += `{${normalizedPayload.reduce((acc, curr, index, arr) => `${acc}${(0, utils_1.uniqueByIncrement)(curr, index, arr)} = '${payload[index]}', `, '')}}`;
        }
        res.json(responsePayload);
    }
    else {
        res.status(400).end('Invalid Payload. POST an array of strings.');
    }
});
