import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export function authorize(ALLOWED_ROLES: Role[]){
    return (req:Request, res:Response, next:NextFunction)=>{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(!ALLOWED_ROLES.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden"})
        }
        next()
    }
}