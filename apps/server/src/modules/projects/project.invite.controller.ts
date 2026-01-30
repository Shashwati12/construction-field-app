import type { Request, Response } from "express";
import { inviteProjectMemberSchema } from "./project.invite.schema";
import { AppError } from "../../utils/AppError";
import { inviteUserToProject } from "./project.invite.service";

export async function inviteProjectMemberController(req: Request, res: Response){
    const parseResult = inviteProjectMemberSchema.safeParse(req.body)
    if(!parseResult.success){
        throw new AppError(parseResult.error.message, 400);
    }
    const {phone, role}=parseResult.data
    const { projectId } = req.params
    const inviterId = req.user?.userId
    if(!inviterId){
        throw new AppError("Unauthorized", 401)
    }
    if (!projectId) {
  throw new AppError("Project ID is required", 400)
}
    const invite=await inviteUserToProject({
        projectId,
        inviterId,
        phone,
        role,
    })
    return res.status(201).json({
        message: "Invite sent successfully",
        invite,
    })
}