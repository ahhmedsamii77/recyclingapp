import mongoose from "mongoose";
import { ConversionStatus, MethodType  } from "../../utils/index.js";

const conversionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    pointsUsed: { type: Number, required: true },
    moneyAdded: { type: Number, required: true },
    status: { type: String, enum: Object.values(ConversionStatus), default: ConversionStatus.PENDING },
    method: {type: String, enum: Object.values(MethodType), default: MethodType.INSTAPAY },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const conversionModel =
  mongoose.models.conversions ||
  mongoose.model("conversions", conversionSchema);

export { conversionSchema,
  conversionModel
 };
