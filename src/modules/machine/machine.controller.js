import { Router } from "express";
import * as MV from "./machine.validation.js";
import MS from "./machine.service.js";
import {
  authentication,
  authorization,
  validation,
} from "../../middleware/index.js";
import { RoleType } from "../../utils/index.js";

const machineRouter = Router();

machineRouter.post(
  "/submit",
  validation(MV.submitSchema),
  MS.submit,
);

// Called by the machine before recycling to confirm user identity on screen
machineRouter.get(
  "/check",
  validation(MV.checkUserSchema),
  MS.checkUser,
);

machineRouter.post(
  "/convertPoints",
  authentication(),
  validation(MV.converPointsSchema),
  MS.convertPoints,
);

machineRouter.patch(
  "/updateConversionStatus/:conversionId",
  authentication(),
  authorization(RoleType.ADMIN),
  validation(MV.updateConversionStatusSchema),
  MS.updateConversionStatus,
);

machineRouter.get(
  "/transactions",
  authentication(),
  authorization(RoleType.ADMIN),
  MS.getAllTransactions
)
machineRouter.get(
  "/conversions",
  authentication(),
  authorization(RoleType.ADMIN),
  MS.getAllConversions
)
export { machineRouter };
