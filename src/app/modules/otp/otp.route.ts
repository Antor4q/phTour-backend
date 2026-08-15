import express from "express"
import { OtpController } from "./otp.controler";

const router = express.Router();

router.post("/send", OtpController.sendOTP);
router.post("/verify",OtpController.verifyOTP)

export const OtpRoutes = router;