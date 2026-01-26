import { Router } from "express";
import * as MV from "./machine.validation.js";
import MS from "./machine.service.js";
import { authentication, validation } from "../../middleware/index.js";

const machineRouter = Router();

machineRouter.post("/submit", authentication(), validation(MV.submitSchema), MS.submit);

machineRouter.post("/convertPoints", authentication(), validation(MV.converPointsSchema), MS.convertPoints);

export { machineRouter };
