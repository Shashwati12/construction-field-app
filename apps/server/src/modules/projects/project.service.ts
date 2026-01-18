import {prisma } from "../../config/prisma"
import { Role } from "@prisma/client"

type createProjectInput = {
    name: string
    location: string
    startDate: string
    ownerId: string
}

const ALLOWED_ROLES = [Role.OWNER, Role.ACCOUNTANT, Role.MANAGER]

export async function createProject(input: createProjectInput){
    const {name, location, startDate, ownerId} = input

    const result = await prisma.$transaction(async(tx) => {
        const project = await tx.project.create({
            data: {
                name,
                location,
                startDate: new Date(startDate),
            }
        })
        
        await tx.projectMember.create({
            data:{
                projectId: project.id,
                userId: ownerId,
                projectRole: Role.OWNER,
            },
        })
        return project
    })
    return result
}

export async function getAccessibleProjects(userId: string){
    const memberships=await prisma.projectMember.findMany({
        where:{
            userId,
            projectRole:{in:ALLOWED_ROLES},
        },
        include:{
            project:{
                select:{
                    id: true,
                    name:true,
                    location:true,
                    status:true,
                    createdAt: true,
                },
            },
        },
        orderBy:{
            project:{createdAt:"desc"},
        },
    })
    return memberships.map(m => m.project)
}

export async function getProjectByIdForUser(projectId:string, userId:string){
    const membership = await prisma.projectMember.findFirst({
        where:{
            projectId, userId
        },
        include:{
            project:{
                select:{
                    id:true,
                    name:true,
                    location:true,
                    status:true,
                    createdAt:true,
                },
            },
        },
    })
    if(!membership){
        return null
    }
    return{
        project:membership.project,
        role:membership.projectRole,
    }
}