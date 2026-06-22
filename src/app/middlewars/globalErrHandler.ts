import { NextFunction, Request, Response } from "express"
import { envVar } from "../config/env"
import AppError from "../errorHelpers/appError"


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrHandler = ((err:any, req: Request, res: Response, next: NextFunction)=>{
    let statusCode = 500
    let message = `Something went wrong!`

    if(err instanceof AppError){
        // 
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }
  res.status(statusCode).json({
    success: false,
    message,
    err,
    Stack: envVar.NODE_ENV === "development" ? err.stack : null
  })
})

// its an globalError Handler