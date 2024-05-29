import { Document } from "mongoose";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  verified: boolean;
  tokens: string[];
}
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}
const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare the password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const UserModel = model("User", userSchema);

export default UserModel;
