/*
  Warnings:

  - You are about to drop the column `LR` on the `Risk` table. All the data in the column will be lost.
  - You are about to drop the column `residualRisk` on the `Risk` table. All the data in the column will be lost.
  - You are about to drop the column `riskAssessment` on the `Risk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Risk` DROP COLUMN `LR`,
    DROP COLUMN `residualRisk`,
    DROP COLUMN `riskAssessment`;
