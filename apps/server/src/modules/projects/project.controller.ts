import type {Request, Response} from "express";
import {createProject, getAccessibleProjects, getProjectByIdForUser} from "./project.service"
import { AppError } from "../../utils/AppError";

export async function createProjectController(req: Request, res:Response){
    
    const {name, location, startDate} = req.body
    const userId=req.user?.userId
    if(!userId){
        throw new AppError("Unauthorized", 401)
    }

        const project = await createProject({
            name,
            location,
            startDate,
            ownerId: userId,
        })
        return res.status(201).json({
        message:"Project created successfully",
        project,
        })
}

export async function listProjects(req:Request, res:Response){
    try{
        const userId=req.user?.userId
        const projects = await getAccessibleProjects(userId as string)
        return res.status(200).json({projects})
    }
    catch(error){
        console.error("LIST PROJECTS ERROR", error)
        return res.status(500).json({
            message: "Internal server erro"
        })
    }
}

export async function getProjectDetails(req:Request, res:Response){
    try{
        const {projectId} = req.params
        const userId=req.user?.userId
        const result=await getProjectByIdForUser(projectId as string, userId as string)
        if(!result){
            return res.status(403).json({message:"Access denied"})
        }
        return res.status(200).json(result)
    }
    catch(error){
        console.error("GET PROJECT DETAILS ERROR", error)
        return res.status(500).json({message:"Internal server error"})
    }
}