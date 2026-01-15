import {z} from "zod"

export const createProjectSchema = z.object({
    name: z.string()
    .trim()
    .min(2, "Project name is required"),

    location: z.string()
    .trim()
    .min(2, "Project location is required"),

    startDate: z.string()
    .refine((value) => {
        const date = new Date(value)
        if(isNaN(date.getTime())) return false
        const today= new Date()
        today.setHours(0, 0, 0, 0)
        return date >= today

    }, "Start date must be today or future date"),
})