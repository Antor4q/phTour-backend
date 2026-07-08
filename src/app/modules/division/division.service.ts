import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const createDivision =async (payload: Partial<IDivision>) => {
 const {name} = payload;
 const isDivisionExist = await Division.findOne({name})

 if(isDivisionExist){
    throw new AppError(httpStatus.BAD_REQUEST, "Division already exists")
 }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

 const division = await Division.create({...payload, slug});
 return division
}


export const DivisionServices = {
    createDivision
}