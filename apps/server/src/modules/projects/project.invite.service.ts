import {prisma} from "../../config/prisma"
import { AppError } from "../../utils/AppError"
import { Role } from "@prisma/client"

type inviteUserToProjectInput = {
    projectId:string
    inviterId:string
    phone:string
    role:Role
}

export async function inviteUserToProject(input:inviteUserToProjectInput) {
    return prisma.$transaction(async(tx)=>{
        const inviterMembership= await tx.projectMember.findUnique({
            where:{
                projectId_userId:{
                    projectId: input.projectId,
                    userId:input.inviterId,
                },
            },
        })
        if(!inviterMembership || inviterMembership.projectRole !== Role.OWNER){
            throw new AppError("Only project owner can invite members", 403)
        }
        const invitedUser = await tx.user.findUnique({
            where:{phone:input.phone},
        })
        if(!invitedUser){
            throw new AppError("User not founf. Ask them to register first.")
        }
        if(input.role===Role.WORKER){
            const activeProjects=await tx.projectMember.findMany({
                where:{
                    userId:invitedUser.id,
                    project:{
                        status:{
                            in:["UPCOMING", "IN_PROGRESS"],
                        },
                    },
                },
                include:{
                    project:true,
                },
            })
            if(activeProjects.length>0){
                throw new AppError(
                    "Worker is already assigned to an active project", 409
                )
            }
        }
        const existingMembership=await tx.projectMember.findUnique({
            where:{
                projectId_userId:{
                    projectId: input.projectId,
                    userId: invitedUser.id,
                },
            },
        })
        if(existingMembership){
            throw new AppError("User is already a member of this project", 409)
        }
        const membership=await tx.projectMember.create({
            data:{
                projectId:input.projectId,
                userId:invitedUser.id,
                projectRole:input.role,
            },
        })
        return membership
    })
}