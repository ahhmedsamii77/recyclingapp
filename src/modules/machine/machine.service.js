import { userModel } from "../../DB/models/user.model.js";
import { conversionModel } from "../../DB/models/conversions.model.js";
import { transactionModel } from "../../DB/models/transaction.model.js";
import {
  AppError,
  ConversionStatus,
  MaterialType,
  TransactionType,
} from "../../utils/index.js";

class MachineService {
  constructor() {}

  submit = async (req, res, next) => {
    const { phone, materialType, weight } = req.body;

    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(404).json({ found: false });
    }

    let points = 0;
    if (materialType === MaterialType.PLASTIC) {
      points = weight;
    } else if (materialType === MaterialType.CAN) {
      points = weight * 4;
    } else {
      throw new AppError("Invalid material type", 400);
    }

    user.points += points;
    await user.save();

    await transactionModel.create({
      userId: user._id,
      materialType,
      weight,
      pointsEarned: points,
      type: TransactionType.EARN,
    });

    return res.status(200).json({
      found: true,
      message: "Points added successfully",
      user: {
        name: user.fullName,
        phone,  // return the original plain phone
      },
      pointsAdded: points,
      totalPoints: user.points,
    });
  };

  // Called by the machine to verify user exists before recycling starts
  checkUser = async (req, res, next) => {
    const { phone } = req.query;

    const user = await userModel.findOne({ phone }).select("fName lName phone points");
    if (!user) {
      return res.status(404).json({ found: false });
    }

    return res.status(200).json({
      found: true,
      user: {
        name: user.fullName,
        phone,
        points: user.points,
      },
    });
  };

  convertPoints = async (req, res, next) => {
    const { points, fullName, phoneNumber, method } = req.body;

    if (points <= 0) throw new AppError("Points must be greater than 0", 400);
    if (req.user.points < points)
      throw new AppError("You don't have enough points", 400);
    if (points % 100 !== 0)
      throw new AppError("Points must be in multiples of 100", 400);

    const money = (points / 100) * 10;

    req.user.points -= points;
    req.user.balance += money;
    await req.user.save();

    await conversionModel.create({
      userId: req.user._id,
      fullName,
      phoneNumber,
      pointsUsed: points,
      moneyAdded: money,
      status: "pending",
      method
    });

    await transactionModel.create({
      userId: req.user._id,
      pointsEarned: -points,
      type: TransactionType.CONVERT,
    });
 

    req.user.phone = phoneNumber;
    await req.user.save();
  
    return res.status(200).json({
      message: "Conversion request submitted successfully",
      moneyAdded: money,
      remainingPoints: req.user.points,
    });
  };
  updateConversionStatus = async (req, res, next) => {
    const { status } = req.body;
    const { conversionId } = req.params;

    const conversion = await conversionModel.findById(conversionId);
    if (!conversion) throw new AppError("Conversion not found", 404);

    if (conversion.status !== ConversionStatus.PENDING) {
      throw new AppError("This request is already processed", 400);
    }

    if (![ConversionStatus.SENT, ConversionStatus.FAILED].includes(status)) {
      throw new AppError("Invalid status value", 400);
    }

    conversion.status = status;
    await conversion.save();

    res.status(200).json({
      message: `Conversion marked as ${status}`,
      conversion,
    });
  };
  getAllTransactions = async (req, res, next) => {
    const transactions = await transactionModel.find().populate({
      path: "userId",
    });
    return res.status(200).json({ transactions });
  };

  getAllConversions = async (req, res, next) => {
    const conversions = await conversionModel.find().populate({
      path: "userId",
    });
    return res.status(200).json({ conversions });
  };
}
export default new MachineService();
