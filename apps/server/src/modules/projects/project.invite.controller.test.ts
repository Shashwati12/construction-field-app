import { inviteProjectMemberController } from "./project.invite.controller";
import * as projectService from "./project.invite.service"
import { AppError } from "../../utils/AppError";

jest.mock("./project.invite.service", ()=>({
    __esModule:true,
    inviteUserToProject:jest.fn(),
}))
function mockReqRes(overrides: Partial<any>={}){
    const req={
        params:{projectId:"project-123"},
        body:{
            phone:"1111111111",
            role:"MANAGER",
        },
        user:{ userId:"owner-123",role:"OWNER"},
        ...overrides,
    }
    const res={
        status:jest.fn().mockReturnThis(),
        json:jest.fn(),
    }
    return {req,res}
}

describe("Project Invitation", ()=>{
    
    it("returns 401 when user is not authenticated", async()=>{
        const {req,res} = mockReqRes({user:null})
        await expect(inviteProjectMemberController(req as any, res as any)
    ).rejects.toMatchObject({ statusCode: 401,
    })
})

    it("returns 400 when body validation fails", async()=>{
        const {req,res}= mockReqRes({
            body:{phone: "123"},
        })
        await expect( inviteProjectMemberController(req as any, res as any)
    ).rejects.toMatchObject({ statusCode: 400 })
    })
    it("returns 403 when service throws error", async()=>{
        ;(projectService.inviteUserToProject as jest.Mock).mockRejectedValue(new AppError("Rorbidden",403))
        const {req,res}=mockReqRes()
        await expect(
            inviteProjectMemberController(req as any, res as any)
        ).rejects.toMatchObject({ statusCode: 403 })
    })
    it("returns 201 when invite sent successfully", async()=>{
        ;(projectService.inviteUserToProject as jest.Mock).mockResolvedValue({
            id:"invite-1",
        })
        const {req, res}= mockReqRes()
        await inviteProjectMemberController(req as any, res as any)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message:"Invite sent successfully",
            })
        )
    })
})