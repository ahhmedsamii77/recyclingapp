import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const contactModel =
  mongoose.models.contacts ||
  mongoose.model("contacts", contactSchema);

export { contactSchema, contactModel };
