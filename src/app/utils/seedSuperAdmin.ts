import { envVar } from "../config/env"
import { IAuthProvider, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async() => {
    try{

        const isSuperAdminExist =  await User.findOne({email: envVar.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("Super Admin Already Exists")
            return
        }
        console.log("trying to create superAdmin")

        const hashedPassword = await bcryptjs.hash(envVar.SUPER_ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVar.SUPER_ADMIN_EMAIL,
            
        }
        const payload = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVar.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }
        const superAdmin = await User.create(payload)
        console.log("super admin created successfully")
        console.log(superAdmin)

    }catch(err){
        console.log(err)
    }
}