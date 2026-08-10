import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface IJwtPayload extends JwtPayload {
    userId: Types.ObjectId | string;
    email: string;
    role: string;
}