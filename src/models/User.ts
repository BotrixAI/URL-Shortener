import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    providers: { type: [String], required: true ,default:[]}, // credentials, google, github
    resetToken: String,
    resetTokenExpiry: Date,

  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
