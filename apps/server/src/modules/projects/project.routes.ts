import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { createProjectController, getProjectDetails, listProjects } from "./project.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

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
router.get("/", authenticate, authorize([Role.OWNER, Role.MANAGER, Role.ACCOUNTANT]), listProjects)
router.get("/:projectId", authenticate,authorize([Role.OWNER, Role.MANAGER, Role.ACCOUNTANT]), getProjectDetails)
export default router