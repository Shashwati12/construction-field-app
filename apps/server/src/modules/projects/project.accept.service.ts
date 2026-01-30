import { InviteStatus } from "../../../generated/prisma/enums"
import {prisma} from "../../config/prisma"
import { AppError } from "../../utils/AppError"
import { Role } from "@prisma/client"

export async function AcceptInviteProject(token:string, userId:string){
    return prisma.$transaction(async (tx) => {
        const invite = await tx.projectInvite.findUnique({
            where: {token},
            include: {
                project: true,
                invitee: true,
            },
        })
        if(!invite){
            throw new AppError("Invalid or expired invite", 404)
        }
        if(invite.expiresAt < new Date()){
            throw new AppError("Invite has expired", 410)
        }
        if(invite.invitedUserId !== userId){
            throw new AppError("This invite does not belong to you", 403)
        }
        
        const existingMembership= await tx.projectMember.findUnique({
            where:{
                projectId_userId:{
                    projectId: invite.projectId,
                    userId,
                },
            },
        })
        if(existingMembership){
            throw new AppError("Already part of the project", 409)
        }

        if(invite.role === Role.WORKER){
            const activeAssignments = tx.projectMember.findMany({
                where:{
                    userId,
                    project:{
                        status:{
                            in: ["UPCOMING", "IN_PROGRESS"],
                        },
                    },
                },
            })
            if((await activeAssignments).length > 0){
                throw new AppError(
                    "Worker is already assigned to an active project",409
                )
            }
        }

        const membership = await tx.projectMember.create({
            data:{
                projectId: invite.projectId,
                userId,
                projectRole: invite.role,
            },
        })
        await tx.projectInvite.update({
            where:{id: invite.id},
            data:{
                status: InviteStatus.ACCEPTED,
                acceptedAt: new Date(),
            },
        })
        
        return{
            project: invite.project,
            role: invite.role,
            membership,
        }

        
    })
}