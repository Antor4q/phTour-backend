/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controler";
import { checkAuth } from "../../middlewars/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVar } from "../../config/env";

const router = Router()

router.post("/login", AuthControllers.credentialLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logOut)
router.post("/change-password",checkAuth(...Object.values(Role)), AuthControllers.changePassword)
router.post("/set-password",checkAuth(...Object.values(Role)), AuthControllers.setPassword)
router.post("/forgot-password", AuthControllers.forgotPassword)
router.post("/reset-password",checkAuth(...Object.values(Role)), AuthControllers.resetPassword)
// Frontend -> forgot-password -> email -> user status check -> short expiration token (valid for 10 minutes) -> email -> frontend link http://localhost:5173/reset-password?email=tariquelislam2015@gmail.com&token=token -> frontend e query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authentication = token -> newPassword -> token verify -> password hash -> save user password

// passport google auth routes
// /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> /frontend home
router.get("/google", async(req: Request, res: Response, next: NextFunction) => {
   const redirect = req.query.redirect || "/"
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res, next)
})
router.get("/google/callback", passport.authenticate("google",{failureRedirect: `${envVar.FRONTEND_URL}/login?error=There is issues with your account. Please contact with our support team`}), AuthControllers.googleAuthCallback)

export const AuthRoutes = router;