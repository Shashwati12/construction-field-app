jest.mock("../../config/prisma", ()=>({
    prisma:{
        projectMember:{
            findFirst:jest.fn(),
        },
    },
}))


import { getProjectByIdForUser } from "./project.service";
import { prisma } from "../../config/prisma";

describe("getProjectByIdForUser", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("returns null when user is not a member of the project", async () => {
    ;(prisma.projectMember.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)

    const result = await getProjectByIdForUser(
      "project-123",
      "user-456"
    )

    expect(result).toBeNull()
  })

  it("returns project and role when user is a project member", async () => {
    const mockMembership = {
      projectRole: "OWNER",
      project: {
        id: "project-123",
        name: "Test Project 1",
        location: "Pune",
        status: "ACTIVE",
        createdAt: new Date(),
      },
    }

    ;(prisma.projectMember.findFirst as jest.Mock)
      .mockResolvedValueOnce(mockMembership)

    const result = await getProjectByIdForUser(
      "project-123",
      "user-456"
    )

    expect(result).toMatchObject({
      role: "OWNER",
      project: {
        id: "project-123",
        name: "Test Project 1",
        location: "Pune",
        status: "ACTIVE",
      },
    })
  })
})