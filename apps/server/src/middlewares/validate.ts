import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
