import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

interface AuthVerificationTokenDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
  compareToken(token: string): Promise<boolean>;
}

const AuthVerificationTokenSchema = new Schema<AuthVerificationTokenDocument>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    expires: 86400, // 60 *00* 24
    default: Date.now,
  },
});

// Encrypting the token before saving
AuthVerificationTokenSchema.pre("save", async function (next) {
  if (!this.isModified("token")) {
    return next();
  }
    this.token = await bcrypt.hash(this.token, 10);
    return next();
});

// Define method to compare tokens
AuthVerificationTokenSchema.methods.compareToken = async function (
  this: AuthVerificationTokenDocument,
  token: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(token, this.token);
  } catch (error) {
    console.error("Error comparing tokens:", error);
    return false; // Return false if an error occurs
  }
};

const AuthVerificationToken = model<AuthVerificationTokenDocument>(
  "AuthVerificationToken",
  AuthVerificationTokenSchema
);

export default AuthVerificationToken;
