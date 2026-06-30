import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVar } from "./env";

passport.use(
    new GoogleStrategy(
        {
            clientID: envVar.GOOGLE_CLIENT_ID,
            clientSecret: envVar.GOOGLE_CLIENT_SECRET,
            callbackURL: envVar.GOOGLE_CALLBACK_URL
        }, async ( )=> {
            // passport js
        }
    )
)