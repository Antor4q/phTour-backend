/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVar } from "../config/env"
import AppError from "../errorHelpers/appError"


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrHandler = ((err:any, req: Request, res: Response, next: NextFunction)=>{

  /**
   * Mongos
   * Mongos errors ki hote pare
   * 1> duplicate error
   * 2> cast error- jkhon vul id deye update korte jabo
   * 3> validation error
   * zod
   * */ 
  const errorSources: any = []
    let statusCode = 500
    let message = `Something went wrong!`
    
    // duplicate error
    if(err.code === 11000){
      console.log("Duplicate error", err.message)
      statusCode = 400
      const duplicate = err.message.match(/"([^"]*)"/)
      console.log(duplicate,"from dulicate error")
      message = `${duplicate[1]} already exists`
    } 
    // object id error
    else if(err.name === "CastError"){
      statusCode = 400;
      message = "Invalid MongoDB ObjectId, Please provide a valid id"
    }
    // zod error
    else if(err.name === "ZodError"){
      statusCode = 400
      message = "Zod Error"
      console.log(err.issues,"from zod")
      err.issues.forEach((issue:any)=> {
        errorSources.push({
          path: issue.path[issue.path],
          message: issue.message
        })
      })
     
    }
    // validation error
    else if(err.name === "ValidationError"){
      statusCode = 400
      const errors = Object.values(err.errors)
      
      errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
      }))
     
      message = err.message
    }
    else if(err instanceof AppError){
        // sage.match(/"([^"]*)"/)
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    Stack: envVar.NODE_ENV === "development" ? err.stack : null
  })
})

// its an globalError Handler