import request from "supertest"
import express from "express"
import { getProjectDetails } from "./project.controller"
import * as projectService from "./project.service"
jest.mock("./project.service", ()=>({
    getProjectByIdForUser: jest.fn(),
}))
const fakeAuth=(req:any, _res:any, next:any) =>{
    req.user={
        userId:"user-123",
        role:"OWNER",
    }
    next()
}
function createTestApp(){
    const app=express()
    app.use(express.json())
    app.get("/projects/:projectId",fakeAuth,getProjectDetails)
    return app
}

describe("GET /projects/:projectId", () =>{
    const app=createTestApp()
    it("returns 403 when user is not a project member", async ()=>{
        ;(projectService.getProjectByIdForUser as jest.Mock).mockResolvedValue(null)

        const res=await request(app).get("/projects/project-123")
        expect(res.status).toBe(403)
        expect(res.body).toEqual({message:"Access denied"})
    })

    it("returns 200 and project details when user is a project member", async()=>{
        const mockResult={
            project:{
                id:"project-123",
                name:"Test Project 1",
                location:"Pune",
                status:"ACTIVE",
                createdAt:new Date().toISOString(),
            },
            role:"OWNER",
        }
        ;(projectService.getProjectByIdForUser as jest.Mock).mockResolvedValue(mockResult)
        const res=await request(app).get("/projects/project-123")
        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockResult)
    })

})