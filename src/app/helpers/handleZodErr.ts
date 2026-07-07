import { TErrorSources, TGenericErrResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerZodErrors = (err:any):TGenericErrResponse => {
  const errorSources :TErrorSources[] = []
 
     
      err.issues.forEach((issue:any)=> {
        errorSources.push({
          // path: issue.path.reverse().join(" inside "),
          path: issue.path[issue.path.length - 1],
          message: issue.message
        })
      })
  return {
     statusCode : 400,
      message : "Zod Error",
      errorSources
}}