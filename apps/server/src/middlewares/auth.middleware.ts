import type { Role } from "@prisma/client"
import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(400).json({ message: "Bad Request" })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string
      role: Role
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  
}
