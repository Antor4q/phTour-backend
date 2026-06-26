import AppError from "../../errorHelpers/appError"
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httStatus from "http-status-codes"
import bcrypt from "bcryptjs"


import { createUserTokens } from "../../utils/userTokens"
import { generateToken, verifyToken } from "../../utils/jwt"
import { envVar } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"


const credentialLogin = async (payload: Partial<IUser>) => {
  
    const {email, password} = payload
console.log("Input Password:", password);
    const isUserExist = await User.findOne({email})
    console.log("DB Password:", isUserExist);
    
        if(!isUserExist){
          throw new AppError(httStatus.BAD_REQUEST, "User Does not Exist")
        }
        console.log("old pass:", password)
        const isPasswordMatched = await bcrypt.compare(password as string,isUserExist.password as string)
      console.log("Matched:", isPasswordMatched);
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
    const verifiedRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload
   
    const isUserExist = await User.findOne({email: verifiedRefreshToken.email})
   
    
        if(!isUserExist){
          throw new AppError(httStatus.BAD_REQUEST, "User Does not Exist")
   
        }
         if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
          throw new AppError(httStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
    if(isUserExist?.isDeleted){
          throw new AppError(httStatus.BAD_REQUEST, "User is Deleted")}
        
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES)
   
    return {
        accessToken
       
    }
   
}

    

export const AuthServices = {
 credentialLogin,
 getNewAccessToken
}