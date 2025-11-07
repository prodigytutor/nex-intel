/*
  Warnings:

  - A unique constraint covering the columns `[runId,name]` on the table `Competitor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competitor_runId_name_key" ON "Competitor"("runId", "name");
