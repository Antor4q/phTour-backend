/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserControllers } from "./user.controler";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewars/validateReq";

import { Role } from "./user.interface";


import { checkAuth } from "../../middlewars/checkAuth";





const router = Router();



router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),UserControllers.getAllUsers)
router.patch("/:id",checkAuth(...Object.values(Role)),UserControllers.updateUser)

export const UserRoutes = router;