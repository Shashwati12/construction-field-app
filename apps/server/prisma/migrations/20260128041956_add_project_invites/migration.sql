/*
  Warnings:

  - Added the required column `invitedUserId` to the `ProjectInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectInvite" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "invitedUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
