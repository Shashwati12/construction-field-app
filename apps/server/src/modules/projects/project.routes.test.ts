import request from "supertest"
import express from "express"
import cookieParser from "cookie-parser"
import projectRoutes from "./project.routes"
import * as projectService from "./project.service"
import jwt from "jsonwebtoken"

jest.mock("jsonwebtoken", () => ({
    __esModule: true,
    default:{
        verify:jest.fn(),
    },
}))
jest.mock("./project.service", ()=>({
    __esModule:true,
    getAccessibleProjects:jest.fn(),
}))
function createTestApp(){
    const app=express()
    app.use(express.json())
    app.use(cookieParser())
    app.use("/projects", projectRoutes)
    return app
}

describe("GET /projects", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })
    it("returns 400 when no auth cookie is present", async()=>{
        const app = createTestApp()
        const res = await request(app).get("/projects")
        expect(res.status).toBe(400)
    })

    it("returns 403 when role is not owner, manager, accountant", async ()=>{
        const app = createTestApp()
        ;(jwt.verify as jest.Mock).mockReturnValue({
            userId: "user-123",
            role:"WORKER",
        })
        const res = await request(app).get("/projects").set("Cookie", ["token=fake.jwt.token"])
        expect(res.status).toBe(403)
    })

    it("returns 200 when role = OWNER", async ()=>{
        const app=createTestApp()
        ;(jwt.verify as jest.Mock).mockReturnValue({
            userId:"user-123",
            role:"OWNER",
        })
        ;(projectService.getAccessibleProjects as jest.Mock).mockResolvedValue([])
        const res=await request(app).get("/projects").set("Cookie", ["token=fake.jwt.token"])
        expect(res.status).toBe(200)
    })

    it("returns 200 when role = MANAGER", async ()=>{
        const app=createTestApp()
        ;(jwt.verify as jest.Mock).mockReturnValue({
            userId:"user-123",
            role:"MANAGER",
        })
        ;(projectService.getAccessibleProjects as jest.Mock).mockResolvedValue([])
        const res = await request(app).get("/projects").set("Cookie", ["token=fake.jwt.token"])
        expect(res.status).toBe(200)
    })

    it("returns 200 when role = ACCOUNTANT", async()=>{
        const app=createTestApp()
        ;(jwt.verify as jest.Mock).mockReturnValue({
            userId:"user-124",
            role:"ACCOUNTANT",
        })
        ;(projectService.getAccessibleProjects as jest.Mock).mockResolvedValue([])
        const res = await request(app).get("/projects").set("Cookie", ["token=fake.jwt.token"])
        expect(res.status).toBe(200)
    })
})