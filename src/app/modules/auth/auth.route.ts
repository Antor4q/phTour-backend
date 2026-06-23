import { Router } from "express";
import { AuthControllers } from "./auth.controler";

const router = Router()

router.post("/login", AuthControllers.credentialLogin)

export const AuthRoutes = router;