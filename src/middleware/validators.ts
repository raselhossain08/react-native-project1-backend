import { RequestHandler } from "express";
import { sendErrors } from "../utils/helper";
import * as yup from "yup";
import { isValidObjectId } from "mongoose";
export const Validate = (schema: yup.Schema): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validate(
        { ...req.body },
        { strict: true, abortEarly: true }
      );
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        sendErrors(res, error.message, 422);
      } else {
        next(error);
      }
    }
  };
};
export const verifyTokenSchema = yup.object({
  id: yup.string().test({
    name: "valid-id",
    message: "invalid user id",
    test:(value) => {
      return isValidObjectId(value);
    }
  }),
  token: yup.string().required("token is missing")
})

