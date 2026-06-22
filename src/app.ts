import express, { Request, Response } from 'express';

import cors from "cors";
import { router } from './app/routes';

import { globalErrHandler } from './app/middlewars/globalErrHandler';



const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
   res.status(200).json({message: 'Hello, World!'});
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use(globalErrHandler)

export default app;