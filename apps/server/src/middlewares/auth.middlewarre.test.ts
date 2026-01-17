import jwt from "jsonwebtoken"
import { authenticate } from "./auth.middleware";
import type { Request, Response, NextFunction } from "express";
import { beforeEach } from "node:test";

jest.mock("jsonwebtoken", () => {
  return {
    __esModule:true,
    default:{
      verify:jest.fn(),
    },
  }
})

function createMocks(){
    const req={
        headers:{
        },
    }as Request
    const res={
        status:jest.fn().mockReturnThis(),
        json:jest.fn(),
    }as unknown as Response
    const next = jest.fn() as NextFunction
    return {req,res,next}
}

describe("authenticate middleware", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })
    it("returns 400 when token is missing", ()=>{
        const {req,res,next}=createMocks()
        authenticate(req,res,next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"Bad Request"})
        expect(next).not.toHaveBeenCalled()
    })

    it("returns 401 when token is invalid", ()=>{
        const {req,res,next} = createMocks()
        req.cookies={
            token: "inavlid.token",
        }
        ;(jwt.verify as jest.Mock).mockImplementation(()=>{
            throw new Error("Invalid token")
        })
        authenticate(req,res,next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"})
        expect(next).not.toHaveBeenCalled()
    })

    it("sets req.user and calls next when token is invalid", ()=>{
        const {req,res,next} = createMocks()
        req.cookies={
            token: "valid.token",
        }
        ;(jwt.verify as jest.Mock).mockReturnValue({
            userId:"user-123",
            role:"OWNER",
        })
        authenticate(req,res,next)
        expect(req.user).toEqual({
            userId:"user-123",
            role:"OWNER",
        })
        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })
})