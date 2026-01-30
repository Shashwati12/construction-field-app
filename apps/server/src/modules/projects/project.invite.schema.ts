import {z} from "zod";
import { Role } from "@prisma/client";

export const inviteProjectMemberSchema=z.object({
    phone:z
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .max(10, "Phone number must be at most 10 digits"),

    role:z.nativeEnum(Role).refine(
        (role)=> role !== Role.OWNER,
        {message: "OWNER cannot be invited to a project"}
    ),
})