import mongoose from "mongoose";
import { GenderType, RoleType, TransactionType } from "../../utils/index.js";

const userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true, trim: true, lowercase: true },
    lName: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    gender: {
      type: String,
      enum: Object.values(GenderType),
      default: GenderType.MALE,
    },
    dateOfBirth: { type: String, required: true },
    points: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    role: {
      type: String,
      enum: Object.values(RoleType),
      default: RoleType.USER,
    },
    phone: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
userSchema.virtual("transactions", {
  ref: "transactions",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("conversions", {
  ref: "conversions",
  localField: "_id",
  foreignField: "userId",
});

userSchema
  .virtual("fullName")
  .set(function (value) {
    const [fName, lName] = value.split(" ");
    this.set({ fName, lName });
  })
  .get(function () {
    return `${this.fName} ${this.lName}`;
  });

const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export { userSchema, userModel };
