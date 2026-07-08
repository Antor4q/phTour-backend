import { Router } from "express";
import { validateRequest } from "../../middlewars/validateReq";
import { createDivisionZodSchema } from "./division.validation";
import { DivisionControllers } from "./division.controler";

const router = Router()

router.post("/create", validateRequest(createDivisionZodSchema), DivisionControllers.createDivision)


export const DivisionRoutes = router;
