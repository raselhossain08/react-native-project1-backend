import { RequestHandler } from "express";
import UserModel from "../models/user";
import crypto from "crypto";
import AuthVerificationToken from "../models/authVerificationToken";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import bcrypt from "bcryptjs";
import { sendErrors } from "../utils/helper";
import jwt from "jsonwebtoken";
import { profile } from "console";
import { mail } from "../utils/mail";
export const Register: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    return sendErrors(res, "Unauthorized request, User already exists", 401);
  const user = await UserModel.create({
    email,
    password,
    name,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerificationToken.create({ owner: user._id, token });

  const link = `http://localhost:3000/verify.html?id=${user._id}&token=${token}`;

  await mail.sendVerification(user.email, link);

  res
    .status(201)
    .json({ message: "User registered successfully, verification email sent" });
};

// verify email
export const VerifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;
  const authToken = await AuthVerificationToken.findOne({ owner: id });
  console.log(authToken);
  if (!authToken) {
    return sendErrors(res, "Unauthorized request", 403);
  }
  const isMatched = authToken.compareToken(token);
  if (!isMatched) {
    return sendErrors(res, "Unauthorized request ! Invalid Token", 403);
  }
  await UserModel.findByIdAndUpdate(id, { verified: true });
  await AuthVerificationToken.findByIdAndDelete(authToken._id);
  res.json({
    success: true,
    message: "Thanks for joining us, your email is verified",
  });
};
export const generateVerificationLink: RequestHandler = async (req, res) => {

  const user = req.user;
  if (user) {
    const token = crypto.randomBytes(36).toString("hex");
    const link = `http://localhost:3000/verify.html?id=${user.id}&token=${token}`;
    await AuthVerificationToken.findOneAndDelete({ owner: user.id });
    await AuthVerificationToken.create({ owner: user.id, token });
    await mail.sendVerification(user.email, link);
      res.json({
        success: true,
        message:
          "Verification link sent to your email. Please check your inbox",
      });
  } else {
    // Handle the case when user is undefined
    console.error("User is undefined");
  }

};

// login
export const Login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user)
    return sendErrors(
      res,
      "Email/Password mismatch, User does not exists",
      403
    );
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return sendErrors(res, "Password mismatch, User does not exists", 403);
  }
  // token
  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, "secret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, "secret");
  if (!user.tokens) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);
  await user.save;
  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};

// get Profile

export const GetProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: { ...req.user },
  });
};
