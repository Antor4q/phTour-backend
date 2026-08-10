/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError"
import { IAuthProvider, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httStatus from "http-status-codes"
import bcrypt from "bcryptjs"


import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVar } from "../../config/env"
import { HttpStatusCode } from "axios"



const credentialLogin = async (payload: Partial<IUser>) => {
  
    const {email, password} = payload

    const isUserExist = await User.findOne({email})
   
    
        if(!isUserExist){
          throw new AppError(httStatus.BAD_REQUEST, "User Does not Exist")
        }
      
        const isPasswordMatched = await bcrypt.compare(password as string,isUserExist.password as string)
     
        if(!isPasswordMatched){
        throw new AppError(httStatus.BAD_REQUEST, "Incorrect password")
    }

    const userTokens = createUserTokens(isUserExist)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = isUserExist.toObject()
    return {
        accessToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user: rest
    }
}
const getNewAccessToken = async (refreshToken: string) => {
   const accessToken =await createNewAccessTokenWithRefreshToken(refreshToken)
   
    return accessToken
       
  
   
}
const changePassword = async (oldPassword: string, newPass: string, decodedToken:JwtPayload) => {

    const user = await User.findById(decodedToken.userId)
   
       const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)

       if(!isOldPasswordMatch){
        throw new AppError(httStatus.UNAUTHORIZED, "Old Password does not match");
       }

      user!.password = await bcrypt.hash(newPass,Number(envVar.BCRYPT_SALT_ROUND))
      user!.save()
  
     
}
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId)
  if(!user){
    throw new AppError(404, "User not found")
  }
  if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
    throw new AppError(httStatus.BAD_REQUEST, "You have already set a password for this account. Please use the change password option instead.")
  }
  const hashedPassword = await bcrypt.hash(plainPassword, Number(envVar.BCRYPT_SALT_ROUND))
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email
  }
  const auths: IAuthProvider[] = [...user.auths, credentialProvider]
  user.password = hashedPassword
  user.auths = auths
  await user.save()
   
     
}
const resetPassword = async (oldPassword: string, newPass: string, decodedToken:JwtPayload) => {

    // const user = await User.findById(decodedToken.userId)
   
    //    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)

    //    if(!isOldPasswordMatch){
    //     throw new AppError(httStatus.UNAUTHORIZED, "Old Password does not match");
    //    }

    //   user!.password = await bcrypt.hash(newPass,Number(envVar.BCRYPT_SALT_ROUND))
    //   user!.save()
    return {}
  
     
}

    

export const AuthServices = {
 credentialLogin,
 getNewAccessToken,
 setPassword,
 changePassword,
 resetPassword
}