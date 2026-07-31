// Frontend --> Form data with image file -> Multer -> form data -> Req (Body + file)
//

import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./env";
import AppError from "../errorHelpers/appError";

cloudinary.config({
    cloud_name: envVar.CLOUDINARY.CLOUDINARY_CLOUD_NAME ,
    api_key: envVar.CLOUDINARY.CLOUDINARY_API_KEY ,
    api_secret: envVar.CLOUDINARY.CLOUDINARY_API_SECRET,
})

export const deleteImageFromCloudinary = async (url: string) => {
 try{
    // https://res.cloudinary.com/dem1keh55/image/upload/v1785390744/z82l74tpbw-1785390742358-riverborn-jpg.jpg.jpg

const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
const match = url.match(regex);
// console.log({match})
if(match && match[1]){
    const public_id = match[1];
    await cloudinary.uploader.destroy(public_id)
    console.log(`File ${public_id} is deleted from cloudinary`)
}
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 }catch(error:any){
    throw new AppError(401, "Cloudinary image deletion failed", error)
 }

}

export const cloudinaryUpload =cloudinary;
