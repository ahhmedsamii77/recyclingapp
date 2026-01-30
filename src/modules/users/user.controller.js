import { Router } from "express";
import * as UV from "./user.validation.js";
import US from "./user.service.js";
import {
  authentication,
  authorization,
  validation,
} from "../../middleware/index.js";
import { RoleType } from "../../utils/index.js";

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

userRouter.get(
  "/",
  authentication(),
  authorization(RoleType.ADMIN),
  US.getUsers,
);

userRouter.patch(
  "/updateUserRole/:userId",
  authentication(),
  authorization(RoleType.ADMIN),
  validation(UV.updateUserRoleSchema),
  US.updateUserRole,
);

userRouter.get("/conversions", authentication(), US.getUserConversions);


userRouter.post("/contactUs",authentication(), validation(UV.contactUsSchema), US.contactUS);


userRouter.get("/contactUs", authentication(), authorization(RoleType.ADMIN),US.getContactUS);

userRouter.get(
  "/:userId",
  authentication(),
  validation(UV.getOneUserSchema),
  US.getUserById,
);


export { userRouter };
