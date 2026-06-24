/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controler";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewars/validateReq";
import jwt, { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/appError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVar } from "../../config/env";





const router = Router();

const checkAuth = (...authRoles: string[]) =>  async(req: Request, res: Response, next: NextFunction)=> {
    try{
        const accessToken = req.headers.authorization;
       
        if(!accessToken){
            throw new AppError(403, "No Token Received")
        }
    const verifiedToken = verifyToken(accessToken, envVar.JWT_ACCESS_SECRET) as JwtPayload
    console.log(verifiedToken.role)
    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "You are not permitted to view this route!!")
    }
   
    next()
    }catch(err){
       
        next(err)
    }
}

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),UserControllers.getAllUsers)

export const UserRoutes = router;