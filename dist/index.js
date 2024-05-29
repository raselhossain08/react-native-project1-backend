"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./db");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/auth', AuthRoutes_1.default);
app.use(function (err, req, res, nextTick) {
    res.status(500).json({ message: err.message });
});
dotenv_1.default.config();
app.listen(3000, () => {
    console.log(' http://localhost:3000 server running');
});
