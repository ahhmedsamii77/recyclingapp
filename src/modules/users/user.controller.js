import { Router } from "express";
import * as UV from "./user.validation.js";
import US from "./user.service.js";
import { authentication, validation } from "../../middleware/index.js";

const userRouter = Router();

// signup
userRouter.post("/auth/signup", validation(UV.signUpSchema), US.signUp);

// login
userRouter.post("/auth/login", validation(UV.loginShcema), US.logIn);

// get me
userRouter.get("/me", authentication(), US.getMe);

// get points and balance
userRouter.get("/points", authentication(), US.getPoints);

userRouter.get("/transactions", authentication(), US.getTransactions);

export { userRouter };
