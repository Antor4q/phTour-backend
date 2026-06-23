/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserControllers } from "./user.controler";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewars/validateReq";





const router = Router();

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users", UserControllers.getAllUsers)

export const UserRoutes = router;