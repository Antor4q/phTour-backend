/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";

import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchable } from "./user.consents";


const createUser = async(payload: Partial<IUser>) => {
 
    const { email, password, ...rest} = payload
    const isUserExist = await User.findOne({email})

    if(isUserExist){
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string,10)
   
    const authProvider: IAuthProvider = {provider:"credentials",providerId:email as string}
    // console.log(email, password, authProvider, rest)
     const user = await User.create({
               
                email,
                password: hashedPassword,
                auths: [authProvider],
                ...rest
            })
           
        return user
}
const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken:JwtPayload ) => {
 
  if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
    if(userId !== decodedToken.userId){
      throw new AppError(401, "You are not authorized")
    }
  }

  

   const ifUserExist = await User.findById(userId);
   if(!ifUserExist){
    throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
   }

   if(decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN){
    throw new AppError(401, "You are not authorized")
   }
   
    /**
     *email: can not update
     name, phone, address, password,
     password - re hashing,
     only admin, superadmin - role,isdeleted..
     promoting to super admin
     * */ 
    if(payload.role){
      if(payload.role === Role.USER || decodedToken.role === Role.GUIDE){
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized")
    }
    // if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
    //   throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized")
    // }
    }
    if(payload.isActive || payload.isDeleted || payload.isVerified){
     if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
       throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized")
     }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId,payload, {new: true,runValidators:true })
    return newUpdatedUser
}

const getAllUsers = async (query: Record<string, string>) => {
  // const users = await User.find({});
  // const totalUsers= await User.countDocuments()

  const queryBuilder = new QueryBuilder(User.find(),query)
  const users = await queryBuilder
  .search(userSearchable)
  .filter()
  .sort()
  .fields()
  .paginate()

 const [data, meta] = await Promise.all([
   users.build(),
   queryBuilder.getMeta()
 ])

  return {
   meta,
   data
  }
}

const getMe = async (userId:string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user
  };
};

const getSingleUser = async (slug: string) => {
  
  const user = await User.findOne({slug}).select("-password");;
 

  return {
   data: user
  }
}



export const UserServices = {
  createUser,
  getAllUsers,
  getMe,
  getSingleUser,
  updateUser,
  
}