import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { createProjectController, getProjectDetails, listProjects } from "./project.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { validate } from "../../middlewares/validate";
import { createProjectSchema } from "./project.schema";

const router = Router()

router.post(
    "/",authenticate, authorize([Role.OWNER]), validate(createProjectSchema),
    createProjectController
)
router.get("/", authenticate, authorize([Role.OWNER, Role.MANAGER, Role.ACCOUNTANT]), listProjects)
router.get("/:projectId", authenticate,authorize([Role.OWNER, Role.MANAGER, Role.ACCOUNTANT]), getProjectDetails)
export default router