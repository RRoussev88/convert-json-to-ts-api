"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.falsyValues = exports.uniqueByIncrement = exports.normalizeInvalidTypeName = exports.POST_VALID_JSON = exports.ENDPOINT_DESCRIPTION = exports.convertToTsString = void 0;
const json_to_ts_1 = __importDefault(require("json-to-ts"));
const convertToTsString = (payload, rootName) => (0, json_to_ts_1.default)(payload, { rootName: rootName === null || rootName === void 0 ? void 0 : rootName.toString() }).map((inter) => {
    const firstBrace = inter.indexOf('{');
    return inter.slice(0, firstBrace) + inter.slice(firstBrace).replace(/(\r\n|\n|\r|\s)/gm, '');
});
exports.convertToTsString = convertToTsString;
exports.ENDPOINT_DESCRIPTION = 'Use the POST version of this endpoint to convert JSON payload to TypeScript';
exports.POST_VALID_JSON = 'POST some valid JSON';
const normalizeInvalidTypeName = (name) => {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        return name;
    }
    else {
        const noSymbolsName = name.replace(/[^a-zA-Z0-9_$]/g, '_');
        const hasValidStart = /^[a-zA-Z_$]/.test(noSymbolsName);
        return hasValidStart ? noSymbolsName : `_${noSymbolsName}`;
    }
};
exports.normalizeInvalidTypeName = normalizeInvalidTypeName;
const uniqueByIncrement = (name, index, namesArr) => {
    if (!namesArr.length || !index || Array.of(new Set(namesArr)).length === namesArr.length) {
        return name;
    }
    const occurrences = namesArr.slice(0, index).filter((nam) => nam === name).length;
    if (occurrences) {
        return `${name}_${occurrences + 1}`;
    }
    return name;
};
exports.uniqueByIncrement = uniqueByIncrement;
exports.falsyValues = ['0', 'false', 'f', 'no', 'n'];
