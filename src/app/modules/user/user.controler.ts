/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { User } from "./user.model";
import htttpStatus from "http-status-codes";

const createUser = async (req: Request, res:Response) => {
    try{
        const { name, email} = req.body;
        const user = await User.create({
            name,
            email
        })
        res.status(htttpStatus.CREATED).json({
            message: "User created successfully",
            user
        })
    }catch(error:any){
        console.log(error)
        res.status(htttpStatus.BAD_REQUEST).json({
            message: `Something went wrong!! ${error.message}`,
           
        })
    }
}


export const UserControllers = {
    createUser
}