import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/appError";
import httStatus from "http-status-codes"


export const createUserTokens = (user: Partial<IUser>)=>{
    const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
        
      
        const accessToken = generateToken(jwtPayload,envVar.JWT_ACCESS_SECRET,envVar.JWT_ACCESS_EXPIRES)
        const refreshToken = generateToken(jwtPayload, envVar.JWT_REFRESH_SECRET,envVar.JWT_REFRESH_EXPIRES)

        return {
            accessToken,
            refreshToken
        }
}

export const createNewAccessTokenWithRefreshToken = async(refreshToken: string) => {
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