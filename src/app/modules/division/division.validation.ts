import z from "zod";


export const createDivisionZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Division name is required"),

slug: z.string().optional(),
  thumbnail: z
    .string()
    .optional(),

  description: z
    .string()
    .optional(),
});

export const updateDivisionZodSchema = z.object({
   name: z
    .string()
    .trim()
    .min(1, "Division name is required"),


  thumbnail: z
    .string()
    .optional(),

  description: z
    .string()
    .optional(),
});
