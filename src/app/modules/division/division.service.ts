import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const createDivision =async (payload: IDivision) => {

 const isDivisionExist = await Division.findOne({name: payload.name})

 if(isDivisionExist){
    throw new AppError(httpStatus.BAD_REQUEST, "Division already exists")
 }

 

  const slug = payload.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

 const division = await Division.create({...payload, slug});
 return division
}

const getAllDivisions = async() => {
  const divisions =  await Division.find({});
  const totalDivisions = await Division.countDocuments();
  return {
   data: divisions,
   meta: {
      total: totalDivisions
   }
  }
}

const updateDivision =async (id: string, payload: Partial<IDivision>) => {
   const existingDivision = await Division.findById(id);
   if(!existingDivision){
    throw new AppError(httpStatus.BAD_REQUEST, "Division not found")
   }
   const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne:id},
   })
   if(duplicateDivision){
    throw new AppError(httpStatus.BAD_REQUEST, "A division with this name already exists");
   }
   const updateDivision = await Division.findByIdAndUpdate(id, payload, {new: true,runValidators: true})
   return updateDivision
}
const deleteDivision = async(id:string) => {
    await Division.findByIdAndDelete(id);
    return null;
}


export const DivisionServices = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision
}