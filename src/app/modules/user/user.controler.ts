/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";


const createUser = async (req: Request, res:Response, next:NextFunction) => {
    try{
        // throw new Error("fake error")
        // throw new AppError(httpStatus.BAD_REQUEST, "fake error")
        const user = await UserServices.createUser(req.body)
        res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            user
        })
    }catch(error:any){
        console.log(error)
        next(error)
    }
}


export const UserControllers = {
    createUser
}


// route matching > controller > service > model > DB