/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/rendResponse"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVar } from "../../config/env"
import { ConnectionStates } from "mongoose"
import passport from "passport"


const credentialLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    // const loginInfo = await AuthServices.credentialLogin(req.body) -- this is custom credential login

    // passportJs credential login start
    passport.authenticate("local", async(err:any,user: any, info:any)=>{

        if(err){
            return next(new AppError(401, err.message))
            // return next(err)
        }
        if(!user){
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)

        const {password,...rest} = user.toObject()

         setAuthCookie(res, userTokens)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest
        },
    })
    })(req,res,next)
    // passportJs credential login end

//   setAuthCookie(res, loginInfo)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "User Logged In Successfully",
//         data: loginInfo,
//     })
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
const changePassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const newPass = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

     await AuthServices.changePassword(oldPassword, newPass, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed Successfully",
        data: null,
    })
})
const setPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const {password} = req.body;
    const decodedToken = req.user
    console.log("decodedToken", decodedToken)
    console.log("passwordhobe", password)

     await AuthServices.setPassword(decodedToken?.userId, password)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password set Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const newPass = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

     await AuthServices.resetPassword(oldPassword, newPass, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password reset Successfully",
        data: null,
    })
})
const forgotPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const { email} = req.body;

     await AuthServices.forgotPassword(email)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email sent Successfully",
        data: null,
    })
})

// google callback controller
const googleAuthCallback = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    let redirectUrl = "";

if (typeof req.query.state === "string") {
  redirectUrl = req.query.state;

  if (redirectUrl.startsWith("/")) {
    redirectUrl = redirectUrl.slice(1);
  }
}
   const user = req.user;
   console.log("user from google", user)
   if(!user){
    throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
   }
   const tokenInfo = await createUserTokens(user)
   setAuthCookie(res, tokenInfo)
    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password reset Successfully",
    //     data: null,
    // })
    res.redirect(`${envVar.FRONTEND_URL}/${redirectUrl}`);
})

export const AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logOut,
    setPassword,
    changePassword,
    resetPassword,
    forgotPassword,
    googleAuthCallback
}