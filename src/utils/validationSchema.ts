import * as yup from "yup";

const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//
yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(EmailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});
export const newUserSchema = yup.object({
  name: yup.string().required("Name Is Missing"),
  email: yup.string().email("Invalid Email !").required("Email Is Missing"),
  password: yup
    .string()
    .required("Password Is Missing")
    .min(8, "Password Should be at least 8 chars long!")
    .matches(passwordPattern, "Password is too simple "),
});
