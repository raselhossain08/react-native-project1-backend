import { RequestHandler } from "express";
import { sendErrors } from "../utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "../models/user";

interface UserProfile {
  id: any;
  name: string;
  email: string;
  verified: boolean;
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile; // Add the user property
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authToken: string | undefined = req.headers.authorization as string;
    if (!authToken) return sendErrors(res, "unauthorized request !!", 402);
    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, "secret") as { id: string };
    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrors(res, "unauthorized request!!", 403);
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendErrors(res, "Session Expired!!", 401);
    }
    if (error instanceof JsonWebTokenError) {
      return sendErrors(res, "unauthorized access!!", 401);
    }
    next(error);
  }
};
