import mongoose from "mongoose";
import { MaterialType, TransactionType  } from "../../utils/index.js";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    materialType: {
      type: String,
      enum: Object.values(MaterialType),
      required: function () {
        return this?.type === TransactionType.EARN;
      },
    },
    weight: {
      type: Number,
      required: function () {
        return this?.type === TransactionType.EARN;
      },
    },
    pointsEarned: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const transactionModel =
  mongoose.models.transactions ||
  mongoose.model("transactions", transactionSchema);

export { transactionSchema,
  transactionModel
 };
