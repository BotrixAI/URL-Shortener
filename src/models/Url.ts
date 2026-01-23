import mongoose, { Schema, models } from "mongoose";

const UrlSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortKey: { type: String, required: true, unique: true },
    expiresAt: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // null = public
  },
  { timestamps: true }
);

export default models.Url || mongoose.model("Url", UrlSchema);
