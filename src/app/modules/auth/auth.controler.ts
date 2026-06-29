/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/rendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/setCookie"


const credentialLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const loginInfo = await AuthServices.credentialLogin(req.body)

  setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})
const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST,"No refresh token received")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)
    setAuthCookie(res, tokenInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})
const logOut = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    res.clearCookie("accessToken",{
        httpOnly: true,
        secure:false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure:false,
        sameSite: "lax"
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const newPass = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

     await AuthServices.resetPassword(oldPassword, newPass, decodedToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password reset Successfully",
        data: null,
    })
})

export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logOut,
    resetPassword
}