import jwt from "jsonwebtoken";
import { userModel  } from "../../DB/models/user.model.js";
import { AppError  } from "../classError.js";

async function generateToken({ payload, signature, options }) {
  return jwt.sign(payload, signature, options);
}

async function verifyToken({ token, signature }) {
  return jwt.verify(token, signature);
}
export async function getSignature({  prefix }) {
    if (prefix === process.env.USER_PREFIX) return process.env.TOKEN_USER;
    else if (prefix == process.env.ADMIN_PREFIX) return process.env.TOKEN_ADMIN;
    else return null;
}


async function decodeTokenAndFetchUser({ token, signature }) {
  const decoded = await verifyToken({ token, signature });
  const user = await userModel.findById(decoded.id);
  if (!user) throw new AppError("User not found", 404);
  return { user, decoded };
}

export { generateToken,
  verifyToken,
  decodeTokenAndFetchUser,
 };
