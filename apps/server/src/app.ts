import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

  app.use(cookieParser());  
  app.use(express.json());

  app.get("/test", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRoutes);

  return app;
}
