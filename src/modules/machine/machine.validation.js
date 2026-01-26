import z from "zod";
import { MaterialType, MethodType  } from "../../utils/index.js";

const submitSchema = {
  body: z.object({
    materialType: z.enum([MaterialType.PLASTIC, MaterialType.CAN], {
      message: "Invalid material type",
    }),
    weight: z.number({ message: "Weight is required" }),
  }),
};

const converPointsSchema = {
  body: z.object({
    points: z.number({ message: "Points is required" }),
    method: z.enum([MethodType.BANK, MethodType.WALLET], {
      message: "Invalid method",
    }),
  }),
};

export { submitSchema,
  converPointsSchema,
 };
