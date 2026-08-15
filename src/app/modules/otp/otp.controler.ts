/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/rendResponse";
import { OtpServices } from "./otp.service";

const sendOTP = catchAsync(async(req: Request, res: Response) => {
    const {email, name} = req.body;
    await OtpServices.sendOTP(email, name)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: null
  })
})
const verifyOTP = catchAsync(async(req: Request, res: Response) => {
    const {email, otp} = req.body;
    await OtpServices.verifyOTP(email, otp) 
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    data: null
  })
})

export const OtpController = {
 sendOTP,
 verifyOTP
}