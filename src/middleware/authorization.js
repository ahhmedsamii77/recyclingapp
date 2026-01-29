import { AppError } from "../utils/classError.js";

export function authorization(roleType) {
  return (req, res, next) => {
    if (req.user.role !== roleType) {
      throw new AppError("Unauthorized", 401);
    }
    return next();
  };
}
