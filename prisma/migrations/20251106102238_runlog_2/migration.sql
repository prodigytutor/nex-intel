/*
  Warnings:

  - You are about to drop the column `notes` on the `Run` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Run" DROP COLUMN "notes",
ADD COLUMN     "lastNote" TEXT,
ADD COLUMN     "qaIssue" TEXT,
ADD COLUMN     "qaSummary" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);
