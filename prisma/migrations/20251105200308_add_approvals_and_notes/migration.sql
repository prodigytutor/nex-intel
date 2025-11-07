-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Finding" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "PricingPoint" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "ProjectInput" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "notes" TEXT;
