/*
  Warnings:

  - You are about to drop the column `notes` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `targetICP` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Deployment" AS ENUM ('CLOUD', 'SELF_HOSTED', 'HYBRID');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('SUBSCRIPTION', 'USAGE_BASED', 'FREEMIUM', 'ONE_TIME', 'TIERED');

-- CreateEnum
CREATE TYPE "SalesMotion" AS ENUM ('PRODUCT_LED', 'SALES_LED', 'ENTERPRISE', 'SELF_SERVE', 'MIXED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "notes",
DROP COLUMN "region",
DROP COLUMN "summary",
DROP COLUMN "targetICP",
DROP COLUMN "updatedAt",
ADD COLUMN     "complianceNeeds" TEXT[],
ADD COLUMN     "deployment" "Deployment",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "inputs" JSONB,
ADD COLUMN     "pricingModel" "PricingModel",
ADD COLUMN     "regions" TEXT[],
ADD COLUMN     "salesMotion" "SalesMotion",
ADD COLUMN     "subIndustry" TEXT,
ADD COLUMN     "targetSegments" TEXT[];

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorCapability" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "competitorId" TEXT,
    "capabilityId" TEXT NOT NULL,
    "evidenceId" TEXT,
    "present" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CompetitorCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vendor" TEXT,
    "category" TEXT,
    "url" TEXT,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceItem" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "ComplianceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Capability" ADD CONSTRAINT "Capability_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorCapability" ADD CONSTRAINT "CompetitorCapability_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorCapability" ADD CONSTRAINT "CompetitorCapability_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorCapability" ADD CONSTRAINT "CompetitorCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceItem" ADD CONSTRAINT "ComplianceItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
