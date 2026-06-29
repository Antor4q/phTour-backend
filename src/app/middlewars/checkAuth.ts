import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>  async(req: Request, res: Response, next: NextFunction)=> {
    try{
        const accessToken = req.headers.authorization;
       
        if(!accessToken){
            throw new AppError(403, "No Token Received")
        }
    const verifiedToken = verifyToken(accessToken, envVar.JWT_ACCESS_SECRET) as JwtPayload

    const isUserExist = await User.findOne({email:verifiedToken.email})

     if(!isUserExist){
                  throw new AppError(httStatus.BAD_REQUEST, "User Does not Exist")
           
                }
     if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
                  throw new AppError(httStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                }
    if(isUserExist?.isDeleted){
                  throw new AppError(httStatus.BAD_REQUEST, "User is Deleted")}
   
    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "You are not permitted to view this route!!")
    }

    req.user = verifiedToken
   
    next()
    }catch(err){
       
        next(err)
    }
}