import mongoose from "mongoose"
import { TGenericErrResponse } from "../interfaces/error.types"

export const handlerCastErrors = (err: mongoose.Error.CastError): TGenericErrResponse => {
  console.log(err)
  return {
     statusCode : 400,
      message : "Invalid MongoDB ObjectId, Please provide a valid id"
  }
}