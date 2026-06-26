import { envVar } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";


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