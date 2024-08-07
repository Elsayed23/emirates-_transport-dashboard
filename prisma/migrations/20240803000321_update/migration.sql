/*
  Warnings:

  - You are about to drop the column `riskId` on the `TraffikLineControlMeasure` table. All the data in the column will be lost.
  - You are about to drop the `Risk` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `questionAnswerId` to the `TraffikLineControlMeasure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Risk` DROP FOREIGN KEY `Risk_questionAnswerId_fkey`;

-- DropForeignKey
ALTER TABLE `TraffikLineControlMeasure` DROP FOREIGN KEY `TraffikLineControlMeasure_riskId_fkey`;

-- AlterTable
ALTER TABLE `QuestionAnswer` ADD COLUMN `activity` LONGTEXT NULL,
    ADD COLUMN `causeOfRisk` LONGTEXT NULL,
    ADD COLUMN `expectedInjury` LONGTEXT NULL,
    ADD COLUMN `hazardSource` LONGTEXT NULL,
    ADD COLUMN `peopleExposedToRisk` LONGTEXT NULL,
    ADD COLUMN `residualRisks` LONGTEXT NULL,
    ADD COLUMN `risk` LONGTEXT NULL,
    ADD COLUMN `riskAssessment` LONGTEXT NULL,
    ADD COLUMN `typeOfActivity` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `TraffikLineControlMeasure` DROP COLUMN `riskId`,
    ADD COLUMN `questionAnswerId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Risk`;

-- AddForeignKey
ALTER TABLE `TraffikLineControlMeasure` ADD CONSTRAINT `TraffikLineControlMeasure_questionAnswerId_fkey` FOREIGN KEY (`questionAnswerId`) REFERENCES `QuestionAnswer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
