"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)(), express_1.default.json(), express_1.default.urlencoded({ extended: true }), (0, morgan_1.default)('combined'));
app.use(router_1.router);
app.use((_, res) => res.status(404).send('Page not Found'));
app.use((error, _, res, __) => { var _a, _b; return res.status(error.statusCode || 500).send((_b = (_a = error.message) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'Internal Server Error'); });
app.listen(port, () => {
    console.log(`Application is running on port ${port}.`);
});
