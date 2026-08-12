/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import AppError from "../errorHelpers/appError";
import httStatus from "http-status-codes"


// passportJs for custom auth start
passport.use(
    new localStrategy(
        {
        usernameField: "email",
        passwordField : "password"
    }, async(email: string,password: string,done)=>{
        try{
// 
            const isUserExist = await User.findOne({email})
   
    
        if(!isUserExist){
          return done(null, false,{message:"User does not exist"})
        }
         if(isUserExist.isVerified === false){
                // throw new AppError(httStatus.BAD_REQUEST, "User is not verified")
                done("User is not verified")
            }
        

           if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
                        //   throw new AppError(httStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                        // }
                         done(`User is ${isUserExist.isActive}`)
           }
            if(isUserExist?.isDeleted){
                          throw new AppError(httStatus.BAD_REQUEST, "User is Deleted")
                        //    done("User is deleted")
                        }
            
           

        // check user google authenticate kina
        const isGoogleAuthenticate = isUserExist.auths.some(providerObjects => providerObjects.provider === "google")

        if(isGoogleAuthenticate && !isUserExist.password){
          return done(null, false,{message:"You have authenticated through Google, So if you want to login with credentials,then at first login with google and set a password your gmail and then you can login with email and password"})
        }

        const isPasswordMatched = await bcrypt.compare(password as string,isUserExist.password as string)
             
                if(!isPasswordMatched){
                return done(null, false,{message:"Password does not matched"})
            }
            return done(null, isUserExist)

        }catch(error){
            done(error)
        }
    })
)
// passportJs for custom auth end

passport.use(
    new GoogleStrategy(
        {
            clientID: envVar.GOOGLE_CLIENT_ID,
            clientSecret: envVar.GOOGLE_CLIENT_SECRET,
            callbackURL: envVar.GOOGLE_CALLBACK_URL
        }, async (accessToken:string, refreshToken:string, profile: Profile, done: VerifyCallback)=> {
           try{
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null, false, {message: "Email not found"});
            }
            let isUserExist = await User.findOne({ email });
        
             if(isUserExist && isUserExist.isVerified === false){
                // throw new AppError(httStatus.BAD_REQUEST, "User is not verified")
                // done("User is not verified")
                done(null, false, {message: "User is not verified"})
            }
        

           if( isUserExist && isUserExist.isActive === IsActive.BLOCKED || isUserExist && isUserExist.isActive === IsActive.INACTIVE){
                        //   throw new AppError(httStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                        // }
                         done(`User is ${isUserExist.isActive}`)
           }
            if(isUserExist?.isDeleted){
                          throw new AppError(httStatus.BAD_REQUEST, "User is Deleted")
                        //    done("User is deleted")
                        }
            
            if(!isUserExist){
                isUserExist = await User.create({
                    name: profile.displayName,
                    email,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths : [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }
            return done(null, isUserExist);
           }catch(error){
            console.log("error in passport google strategy", error)
            return done(error, false);
           }

        }
    )
)
// frontend url : http://localhost:5173 -> localhost:5000/api/v1/auth/google -> passport -> google auth consent -> gmail login -> success -> callback url -> passport -> frontend url

passport.serializeUser((user: any, done: (err:any, id?: unknown)=> void) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
   try{
    const user = await User.findById(id);
    done(null, user);
   }catch(error){
    console.log(error)
    done(error, null)
   }
})