import z from "zod";
import { GenderType, generalRules  } from "../../utils/index.js";

const signUpSchema = {
  body: z.object({
    fName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
    email: generalRules.email,
    password: generalRules.password,
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    gender: z.enum([GenderType.MALE, GenderType.FEMALE], { message: "Invalid gender" }),
    country: z.string().min(3, { message: "Country must be at least 3 characters long" }),
    dateOfBirth: z.string({ message: "Date of birth is required" }),
  }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword", "password"],
      });
    }
  })
};

const loginShcema = {
  body: z.object({
    email: generalRules.email,
    password: generalRules.password
  })
};

const getOneUserSchema = z.strictObject({
  id: generalRules.id
});

export { signUpSchema,
  loginShcema,
  getOneUserSchema
 };
