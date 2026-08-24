/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError"
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVar } from "../../config/env"
import { HttpStatusCode } from "axios"
import { sendEmail } from "../../utils/sendEmail"



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

  // check if old password and new password is same give an error

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
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(401, "You can not reset your password");
  }

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(401, "User does not exist");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envVar.BCRYPT_SALT_ROUND)
  );

  isUserExist.password = hashedPassword;

  await isUserExist.save();
};
const forgotPassword = async (email:string) => {

    const isUserExist = await User.findOne({email})
     if(!isUserExist){
                  throw new AppError(httStatus.BAD_REQUEST, "User Does not Exist")
           
                }
     if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
                  throw new AppError(httStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                }
    if(isUserExist?.isDeleted){
                  throw new AppError(httStatus.BAD_REQUEST, "User is Deleted")}
    
    if(isUserExist.isVerified === false){
        throw new AppError(httStatus.BAD_REQUEST, "User is not verified")
    }

    const jwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role
    }
    const resetToken = jwt.sign(jwtPayload, envVar.JWT_ACCESS_SECRET, {
      expiresIn: "10m"
    })

    const resetUiLink = `${envVar.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
      to: isUserExist.email,
      subject: "Password Reset",
      templateName: "forgotPassword",
      templateData: {
        name: isUserExist.name,
        resetUiLink
      }
    })
   
  
     
}

    

export const AuthServices = {
 credentialLogin,
 getNewAccessToken,
 setPassword,
 changePassword,
 resetPassword,
 forgotPassword
}