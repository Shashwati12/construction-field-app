import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
export async function createUser(name:string, phone:string, password:string){
    const existingUser = await prisma.user.findUnique({
        where: {phone},
    });
    if(existingUser){
        throw new Error("Phone already exists");
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
        data:{
            name,
            phone,
            password: hashedPassword,
            role: Role.OWNER,
        },
    });
    return user;
}

export async function findUserByPhone(phone: string){
    return prisma.user.findUnique({
        where: {phone},
    });
}

export async function verifyPassword(
    plainPassword: string,
    hashedPassword: string
){
    return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user: {id:string; role:string}){
    return jwt.sign(
        {
            userId:user.id,
            role:user.role,
        },
        process.env.JWT_SECRET as string,
        {expiresIn: "7d"}
    );
}