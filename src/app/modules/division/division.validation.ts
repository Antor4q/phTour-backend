import z from "zod";


export const createDivisionZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Division name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required"),

  thumbnail: z
    .string()
    .trim()
    .url("Thumbnail must be a valid URL")
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),
});