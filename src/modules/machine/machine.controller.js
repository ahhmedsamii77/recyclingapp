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
  authentication(),
  validation(MV.submitSchema),
  MS.submit,
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
  "/conversions",
  authentication(),
  MS.getUserConversions
)
export { machineRouter };
