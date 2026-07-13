import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
            name: z.string({error: "nickname must be string"})
         .min(2,{message: "Name must be at least 2 character long"})
         .max(50,{message: "Name cannot exceed 50 characters."})
           ,
           slug: z.string().optional(),
            email: z
            .string({error: "Email must be string"})
            .email({message: "Invalid email address format."})
            .min(5,{message: "Email must be at least 5 characters long."}).max(100, {message: "Email cannot exceed 100 characters."}),
            // 1 uppercase, 1 special character, 1 digit, 8 character min
            password:z
            .string()
            .min(8,{message:"Password must be at least 8 characters long."})
            .regex(/^(?=.*[A-Z]).+$/, {message:"Password must contain at least 1 uppercase letter."})
            .regex(/^(?=.*[^A-Za-z0-9]).+$/,{message: "password must contain at least 1 special character"})
            .regex(/^.{8,}$/,{message: "Password must contain at least 1 number."}),
            phone:z
            .string({error: "Phone number must be"}).regex(/^(?:\+8801\d{9}|01\d{9})$/,{message: "Phone number must be valid for Bangladesh. Format: +8801********* or 01*********"})
            .optional(),
            address:z
            .string({message: "Address must be string"})
            .max(200,{message: "Address cannot exceed 200 characters."})
            .optional()
    })


export const updateUserZodSchema = z.object({
         name: z
         .string({error: "Name must be string"})
         .min(2,{message: "Name must be at least 2 character long"})
         .max(50,{message: "Name cannot exceed 50 characters."})
         .optional(),
           
            // 1 uppercase, 1 special character, 1 digit, 8 character min
            password:z
            .string()
            .min(8,{message:"Password must be at least 8 characters long."})
            .regex(/^(?=.*[A-Z]).+$/, {message:"Password must contain at least 1 uppercase letter."})
            .regex(/^(?=.*[^A-Za-z0-9]).+$/,{message: "password must contain at least 1 special character"})
            .regex(/^.{8,}$/,{message: "Password must contain at least 1 number."}).optional(),
            phone:z
            .string({error: "Phone number must be"}).regex(/^(?:\+8801\d[9]|01\d[9])$/,{message: "Phone number must be valid for Bangladesh. Format: +8801********* or 01*********"})
            .optional(),
            address:z
            .string({message: "Address must be string"})
            .max(200,{message: "Address cannot exceed 200 characters."})
            .optional(),
            role: z.enum(Object.values(Role) as [string]).optional(),
            isActive:z.enum(Object.values(IsActive) as [string]).optional(),
            isDeleted:z.boolean({error: "isDeleted must be true or false"}).optional(),
            isVerified:z.boolean({error: "isVerified must be true or false"}).optional()
           
    })