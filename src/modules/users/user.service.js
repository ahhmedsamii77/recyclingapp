import { userModel } from "../../DB/models/user.model.js";
import { transactionModel } from "../../DB/models/transaction.model.js";
import { v4 as uuid } from "uuid";
import {
  AppError,
  Compare,
  generateToken,
  Hash,
  RoleType,
} from "../../utils/index.js";

class UserService {
  constructor() {}

  // signup
  signUp = async (req, res, next) => {
    const { fName, lName, email, password, gender, country } = req.body;

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
      payload: { id: user._id, email, role: user.role },
      signature:
        user.role === RoleType.USER
          ? process.env.TOKEN_USER
          : process.env.TOKEN_ADMIN,
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

  getUsers = async (req, res, next) => {
    const users = await userModel.find().populate([
      {
        path: "transactions",
      },
      {
        path: "conversions",
      },
    ]);
    return res.status(200).json({ users });
  };

  updateUserRole = async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await userModel.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    if (req.user._id.toString() === userId) {
      throw new AppError("You cannot change your own role", 400);
    }

    if (user.role === role) {
      throw new AppError("User already has this role", 400);
    }

    if (user.role === RoleType.ADMIN) {
      throw new AppError("You cannot change another admin's role", 403);
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      userId: user._id,
      newRole: user.role,
    });
  };

  getUserById = async (req, res, next) => {
    const { userId } = req.params;
    const user = await userModel.findById(userId).populate([
      {
        path: "transactions",
      },
      {
        path: "conversions",
      }
    ]);
    if (!user) throw new AppError("User not found", 404);
    return res.status(200).json({ user });
  };
    getUserConversions = async (req, res, next) => {
    const conversions = await conversionModel.find({ userId: req.user._id });
    return res.status(200).json({ conversions });
  };
}

export default new UserService();
