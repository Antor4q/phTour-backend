import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"


const createDivision =async (payload: IDivision) => {
//   const baseSlug = payload.name.toLowerCase().split(" ").join("-")

//   let slug = `${baseSlug}-division`
//   let counter = 0
//   while(await Division.exists({slug})){
//    slug = `$slug-${counter++}`
//   }
//   payload.slug = slug

 const isDivisionExist = await Division.findOne({name: payload.name})

 if(isDivisionExist){
    throw new AppError(httpStatus.BAD_REQUEST, "Division already exists")
 }

 



 const division = await Division.create(payload);
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
const getSingleDivision = async(slug:string) => {
  const division =  await Division.findOne({slug});
  
  return {
   data: division,
   
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

//    if(payload.name){
//        const baseSlug = payload.name.toLowerCase().split(" ").join("-")

//   let slug = `${baseSlug}-division`
//   let counter = 0
//   while(await Division.exists({slug})){
//    slug = `$slug-${counter++}`
//   }
//   payload.slug = slug
//    }
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
    getSingleDivision,
    updateDivision,
    deleteDivision
}