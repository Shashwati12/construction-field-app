import type {Request, Response} from "express";
import { createProjectSchema } from "./project.schema";
import {createProject, getAccessibleProjects, getOwnerProjects} from "./project.service"
import { string } from "zod";

export async function createProjectController(req: Request, res:Response){
    const parseResult = createProjectSchema.safeParse(req.body)
    if(!parseResult.success){
        return res.status(400).json({
            errors: parseResult.error.format(),
        })
    }

    const {name, location, startDate} = parseResult.data
    const userId=req.user?.userId
    if(!userId){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const project = await createProject({
            name,
            location,
            startDate,
            ownerId: userId,
        })
        return res.status(201).json({
            message: "Project created successfully",
            project,
        })
    }
    catch(error){
        console.error("CREATE PROJECT ERROR", error)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export async function listOwnerProjects(req: Request, res: Response){
    try{
        const userId =req.user?.userId
        const projects = await getOwnerProjects(userId as string)
        return res.status(200).json({
            projects,
        })
    }
    catch(error){
        console.error("LIST OWNER PROJECTS ERROR", error)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
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