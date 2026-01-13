import type { Request, Response } from "express";
import { registerSchema } from "./auth.schema";
import { createUser, findUserByPhone, verifyPassword, generateToken } from "./auth.service";
export async function registerUser(req: Request, res: Response){
    const parseResult = registerSchema.safeParse(req.body);
    if(!parseResult.success){
        return res.status(400).json({
            errors: parseResult.error.format(),
        });
    }
    const {name, phone, password} = parseResult.data;
    try{
        const user = await createUser(name, phone, password);
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch(error:any){
        console.error("REGISTER ERROR", error);
        if(error.message==="Phone already exists"){
            return res.status(409).json({
                message: "Phone number already registered",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
} 

export async function loginUser(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;

    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.cookie("token", token,{
      httpOnly:true,
      sameSite:"lax",
      secure:false,
      maxAge: 7*24*60*60*1000,
    })

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

