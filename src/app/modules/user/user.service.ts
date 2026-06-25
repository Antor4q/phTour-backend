/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env";


const createUser = async(payload: Partial<IUser>) => {
    const { email, password, ...rest} = payload

    const isUserExist = await User.findOne({email})

    if(isUserExist){
      throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string,10)
   
    const authProvider: IAuthProvider = {provider:"credentials",providerId:email as string}
     const user = await User.create({
               
                email,
                password: hashedPassword,
                auths: [authProvider],
                ...rest
            })
        return user
}
const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken:JwtPayload ) => {
   const ifUserExist = await User.findById(userId);
   if(!ifUserExist){
    throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
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
    if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized")
    }
    }
    if(payload.isActive || payload.isDeleted || payload.isVerified){
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized")
    }
    if(payload.password){
      payload.password = await bcryptjs.hash(payload.password, envVar.BCRYPT_SALT_ROUND)
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId,payload, {new: true,runValidators:true })
    return newUpdatedUser
}

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers= await User.countDocuments()
  return {
    data: users,
    meta: {
      total: totalUsers
    }
  }
}

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser
}