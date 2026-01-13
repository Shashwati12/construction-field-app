import { z } from "zod";
export const registerSchema = z.object({
    name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

    phone:z
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .max(10, "Phone number must be at most 10 digits"),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  phone: z.string().min(10).max(10),
  password: z.string().min(8),
});