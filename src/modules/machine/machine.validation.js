import z from "zod";
import { ConversionStatus, MaterialType, MethodType  } from "../../utils/index.js";
import { Types } from "mongoose";

const submitSchema = {
  body: z.object({
    phone: z.string({ message: "Phone number is required" }).min(10, { message: "Phone number must be at least 10 digits" }),
    materialType: z.enum([MaterialType.PLASTIC, MaterialType.CAN], {
      message: "Invalid material type",
    }),
    weight: z.number({ message: "Weight is required" }),
  }),
};

const converPointsSchema = {
  body: z.object({
    fullName: z.string().min(3, { message: "Full name must be at least 3 characters long" }),
    phoneNumber: z.string().min(3, { message: "Phone number must be at least 3 characters long" }),
    points: z.number({ message: "Points is required" }),
  }),
};

const updateConversionStatusSchema = {
  params: z.object({
    conversionId: z.string().refine((value) => Types.ObjectId.isValid(value), { message: "Invalid id" }),
  }),
  body: z.object({
    status: z.enum([ConversionStatus.SENT, ConversionStatus.FAILED], { message: "Invalid status" }),
  }),
}

const checkUserSchema = {
  query: z.object({
    phone: z.string({ message: "Phone number is required" }).min(10, { message: "Phone number must be at least 10 digits" }),
  }),
};

export { submitSchema, converPointsSchema, updateConversionStatusSchema, checkUserSchema };
