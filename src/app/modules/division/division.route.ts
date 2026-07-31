import { Router } from "express";
import { validateRequest } from "../../middlewars/validateReq";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { DivisionControllers } from "./division.controler";
import { checkAuth } from "../../middlewars/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router()

router.post(
"/create",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
multerUpload.single("file"),
validateRequest(createDivisionZodSchema),
 DivisionControllers.createDivision)

router.get("/", DivisionControllers.getAllDivisions);
router.get("/:slug",DivisionControllers.getSingleDivision)
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDivisionZodSchema), DivisionControllers.updateDivision);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionControllers.deleteDivision)


export const DivisionRoutes = router;
