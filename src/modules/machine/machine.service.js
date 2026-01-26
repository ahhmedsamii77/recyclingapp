import { conversionModel  } from "../../DB/models/conversions.model.js";
import { transactionModel  } from "../../DB/models/transaction.model.js";
import { AppError,
  MaterialType,
  TransactionType,
 } from "../../utils/index.js";

class MachineService {
  constructor() {}

  submit = async (req, res, next) => {
    const { materialType, weight } = req.body;
    let points = 0;

    if (materialType === MaterialType.PLASTIC) {
      points = weight;
    } else if (materialType === MaterialType.CAN) {
      points = weight * 4;
    } else {
      throw new AppError("Invalid material type", 400);
    }

    req.user.points += points;
    await req.user.save();

    await transactionModel.create({
      userId: req.user._id,
      materialType,
      weight,
      pointsEarned: points,
      type: TransactionType.EARN,
    });

    return res.status(200).json({
      pointsAdded: points,
      totalPoints: req.user.points,
    });
  };

  convertPoints = async (req, res, next) => {
    const { points, method } = req.body;
    if (points <= 0) throw new AppError("Points must be greater than 0", 400);
    if (req.user.points < points)
      throw new AppError("You don't have enough points", 400);
    if (points % 100 !== 0)
      throw new AppError("Points must be in multiples of 100", 400);

    const pointsToMoney = 100;
    const money = points / pointsToMoney;
    
    req.user.points -= points;
    req.user.balance += money;
    await req.user.save();

    await conversionModel.create({
      userId: req.user._id,
      pointsUsed: points,
      method,
      moneyAdded: money,
    });

    await transactionModel.create({
      userId: req.user._id,
      pointsEarned: points,
      type: TransactionType.CONVERT,
    });

    return res.status(200).json({
      message: "Points converted to money successfully",
      balance: req.user.balance,
      remainingPoints: req.user.points,
      moneyAdded: money,
    });
  };
}

export default new MachineService();
