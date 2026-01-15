import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { createProjectController, listProjects } from "./project.controller";

const router = Router()

router.post(
    "/",authenticate,(req, res, next) => {
        if(req.user?.role !== "OWNER"){
            return res.status(403).json({message: "Forbidden"})
        }
        next()
    },
    createProjectController
)
router.get("/", authenticate, listProjects)
export default router