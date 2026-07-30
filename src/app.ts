import express, { Request, Response } from 'express';

import cors from "cors";
import { router } from './app/routes';

import { globalErrHandler } from './app/middlewars/globalErrHandler';
import notFound from './app/middlewars/notFound';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from "express-session"
import './app/config/passport'



const app = express();

// middleWars for passport

app.use(expressSession({
   secret: "Your secret",
   resave: false,
   saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
// end
app.use(cookieParser());
app.use(express.json());
// for handling properly form data
app.use(express.urlencoded({extended:true}))
app.use(cors());

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
   res.status(200).json({message: 'Hello, World!'});
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use(globalErrHandler)

// not found route
app.use(notFound)

export default app;