import { TGenericErrResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateErrors = (err: any): TGenericErrResponse => {
  const duplicate = err.message.match(/"([^"]*)"/)
  return {
    statusCode : 400,
    message: `${duplicate[1]} already exists`
  }
}