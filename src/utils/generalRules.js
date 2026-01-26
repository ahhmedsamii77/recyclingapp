import { Types  } from "mongoose";
import z from "zod";

const generalRules = {
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  id: z.string().refine((value) => Types.ObjectId.isValid(value), { message: "Invalid id" }),
};

export { generalRules,
 };
