import { Types } from "mongoose";

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface ITour{
    name:string
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    picture?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?:boolean;
    role: Role;
    auths : IAuthProvider[];
    bookings?: Types.ObjectId[];
    guide?: Types.ObjectId[];
}