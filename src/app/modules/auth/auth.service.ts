import AppError from "../../errorHelpers/appError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httStatus from "http-status-codes"
import bcrypt from "bcryptjs"


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
    

    return {
        email: isUserExist.email
    }
}

    

export const AuthServices = {
 credentialLogin
}