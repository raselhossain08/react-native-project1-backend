"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrors = void 0;
const sendErrors = (res, message, statusCode) => {
    res.status(statusCode).json({ message });
};
exports.sendErrors = sendErrors;
