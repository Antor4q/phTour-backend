/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

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
            let user = await User.findOne({ email });
            if(!user){
                user = await User.create({
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
            return done(null, user);
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