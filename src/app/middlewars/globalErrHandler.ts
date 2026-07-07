/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVar } from "../config/env"
import AppError from "../errorHelpers/appError"

import { handlerDuplicateErrors } from "../helpers/handleDuplicateErr"
import { handlerCastErrors } from "../helpers/handleCastErr"
import { handlerZodErrors } from "../helpers/handleZodErr"
import { handlerValidationErrors } from "../helpers/handleValidationErr"
import { TErrorSources } from "../interfaces/error.types"


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrHandler = ((err:any, req: Request, res: Response, next: NextFunction)=>{
 if(envVar.NODE_ENV === "development"){
            console.log(err)
        }
  /**
   * Mongos
   * Mongos errors ki hote pare
   * 1> duplicate error
   * 2> cast error- jkhon vul id deye update korte jabo
   * 3> validation error
   * zod
   * */ 
    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = `Something went wrong!`
    
    // duplicate error
    if(err.code === 11000){
      
      const simplifiedError = handlerDuplicateErrors(err)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
    } 
    // object id error
    else if(err.name === "CastError"){
      const simplifiedErr= handlerCastErrors(err)
      statusCode = simplifiedErr.statusCode
      message = simplifiedErr.message
    }
    // zod error
    else if(err.name === "ZodError"){
      const simplifiedErr = handlerZodErrors(err)
      statusCode = simplifiedErr.statusCode
      message = simplifiedErr.message
      errorSources = simplifiedErr.errorSources as TErrorSources[]
     }
 // validation error
    else if(err.name === "ValidationError"){
      const simplifiedError = handlerValidationErrors(err)
      statusCode = simplifiedError.statusCode
      errorSources = simplifiedError.errorSources as TErrorSources[]
      message = simplifiedError.message
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
    err : envVar.NODE_ENV === "development" ? err : null,
    Stack: envVar.NODE_ENV === "development" ? err.stack : null
  })
})

// its an globalError Handler