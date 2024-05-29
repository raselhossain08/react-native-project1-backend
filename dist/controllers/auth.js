"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = __importDefault(require("crypto"));
const authVerificationToken_1 = __importDefault(require("../models/authVerificationToken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helper_1 = require("../utils/helper");
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!name)
            return (0, helper_1.sendErrors)(res, "Name is Missing", 422);
        if (!email)
            return (0, helper_1.sendErrors)(res, "Email is Missing", 422);
        if (!password)
            return (0, helper_1.sendErrors)(res, "Password is Missing", 422);
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser)
            return (0, helper_1.sendErrors)(res, "Unauthorized request, User already exists", 401);
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({ email, password: hashedPassword, name });
        yield user.save();
        const token = crypto_1.default.randomBytes(36).toString('hex');
        yield authVerificationToken_1.default.create({ owner: user._id, token });
        const link = `http://localhost:3000/verify?id=${user._id}&token=${token}`;
        const mailOptions = {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "rahatulwork@gmail.com",
                pass: "skvejhcbfqumfgxy"
            }
        };
        const transport = nodemailer_1.default.createTransport(mailOptions);
        yield transport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification",
            html: `<a href="${link}">Click here to verify your email</a>`,
        });
        res.status(201).json({ message: "User registered successfully, verification email sent" });
    }
    catch (error) {
        next(error);
    }
});
exports.Register = Register;
