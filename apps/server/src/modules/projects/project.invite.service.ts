import { prisma } from "../../config/prisma"
import { sendEmail } from "../../services/email/email.service"
import { projectInviteTemplate } from "../../services/email/templates/project-invite"
import { AppError } from "../../utils/AppError"
import { Role } from "@prisma/client"
import crypto from "crypto"

type InviteUserToProjectInput = {
  projectId: string
  inviterId: string
  phone: string
  email: string
  role: Role
}

export async function inviteUserToProject(input: InviteUserToProjectInput) {
  return prisma.$transaction(async (tx) => {

    const inviterMembership = await tx.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: input.projectId,
          userId: input.inviterId,
        },
      },
    })

    if (!inviterMembership || inviterMembership.projectRole !== Role.OWNER) {
      throw new AppError("Only project owner can invite members", 403)
    }

    const invitedUser = await tx.user.findUnique({
      where: { phone: input.phone },
    })

    if (!invitedUser) {
      throw new AppError("User not found. Ask them to register first.", 404)
    }

    if (input.role === Role.WORKER) {
      const activeProjects = await tx.projectMember.findMany({
        where: {
          userId: invitedUser.id,
          project: {
            status: {
              in: ["UPCOMING", "IN_PROGRESS"],
            },
          },
        },
      })

      if (activeProjects.length > 0) {
        throw new AppError(
          "Worker is already assigned to an active project",
          409
        )
      }
    }

    const existingMembership = await tx.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: input.projectId,
          userId: invitedUser.id,
        },
      },
    })

    if (existingMembership) {
      throw new AppError("User is already a member of this project", 409)
    }

    const token = crypto.randomUUID()

    const invite = await tx.projectInvite.create({
      data: {
        projectId: input.projectId,
        invitedBy: input.inviterId,
        email: input.email,
        role: input.role,
        token,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
      },
    })

    const inviteLink = `${process.env.WEB_URL}/invites/${token}`

    await sendEmail({
      to: input.email,
      subject: "Project Invitation",
      html: projectInviteTemplate({
        projectName: "Project Name", // fetch later
        inviterName: "Owner Name",   // fetch later
        inviteLink,
      }),
    })

    return invite
  })
}
