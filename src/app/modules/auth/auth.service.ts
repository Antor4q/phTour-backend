import AppError from "../../errorHelpers/appError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httStatus from "http-status-codes"
import bcrypt from "bcryptjs"


import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"



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

    

export const AuthServices = {
 credentialLogin,
 getNewAccessToken
}