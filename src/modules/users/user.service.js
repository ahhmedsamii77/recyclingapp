import { userModel  } from "../../DB/models/user.model.js";
import { transactionModel  } from "../../DB/models/transaction.model.js";
import { v4 as uuid } from "uuid";
import { AppError,
  Compare,
  generateToken,
  Hash,
 } from "../../utils/index.js";

class UserService {
  constructor() {}

  // signup
  signUp = async (req, res, next) => {
    const {
      fName,
      lName,
      email,
      password,
      gender,
      country,
    } = req.body;

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) throw new AppError("User already exist", 400);

    const hashedPassword = await Hash({ plainText: password });
    const user = await userModel.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      gender,
      country,
      dateOfBirth: new Date().toISOString(),
    });

    return res.status(201).json({ message: "User created successfully", user });
  };

  // login
  logIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await Compare({
      plainText: password,
      cipherText: user.password,
    });
    if (!isMatch) throw new AppError("Invalid password", 400);

    const jwtid = uuid();
    const token = await generateToken({
      payload: { id: user._id, email },
      signature: process.env.TOKEN,
      options: { jwtid },
    });

    return res.status(200).json({ message: "Login successfully", token });
  };

  // get me
  getMe = async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    if (!user) throw new AppError("User not found", 404);
    return res.status(200).json({ message: "User found", user });
  };

  getPoints = async (req, res, next) => {
    return res
      .status(200)
      .json({ points: req.user.points, balance: req.user.balance });
  };

  getTransactions = async (req, res, next) => {
    const transactions = await transactionModel.find({
      userId: req.user._id,
    });
    return res.status(200).json({ transactions });
  };
}

export default new UserService();
