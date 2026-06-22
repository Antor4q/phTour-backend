/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";







// const createUser = async (req: Request, res:Response, next:NextFunction) => {
//     try{
//         // throw new Error("fake error")
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake error")
//         const user = await UserServices.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user
//         })
//     }catch(error:any){
//         console.log(error)
//         next(error)
//     }
// }
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body)
    res.status(httpStatus.CREATED).json({
        message: "User Created Successfully",
        user
    })
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const users = await UserServices.getAllUsers();
    res.status(httpStatus.OK).json({
        success: true,
        message: "All Users Retrieved Successfully",
        data: users
    })
})


export const UserControllers = {
    createUser,
    getAllUsers
}


// route matching > controller > service > model > DB