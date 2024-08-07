/*
  Warnings:

  - You are about to drop the column `activity` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `causeOfRisk` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `expectedInjury` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `hazardSource` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `peopleExposedToRisk` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `residualRisks` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `risk` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `riskAssessment` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfActivity` on the `QuestionAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `questionAnswerId` on the `TraffikLineControlMeasure` table. All the data in the column will be lost.
  - Added the required column `riskId` to the `TraffikLineControlMeasure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TraffikLineControlMeasure` DROP FOREIGN KEY `TraffikLineControlMeasure_questionAnswerId_fkey`;

-- AlterTable
ALTER TABLE `QuestionAnswer` DROP COLUMN `activity`,
    DROP COLUMN `causeOfRisk`,
    DROP COLUMN `expectedInjury`,
    DROP COLUMN `hazardSource`,
    DROP COLUMN `peopleExposedToRisk`,
    DROP COLUMN `residualRisks`,
    DROP COLUMN `risk`,
    DROP COLUMN `riskAssessment`,
    DROP COLUMN `typeOfActivity`;

-- AlterTable
ALTER TABLE `TraffikLineControlMeasure` DROP COLUMN `questionAnswerId`,
    ADD COLUMN `riskId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Risk` (
    `id` VARCHAR(191) NOT NULL,
    `questionAnswerId` VARCHAR(191) NULL,
    `causeOfRisk` LONGTEXT NULL,
    `activity` LONGTEXT NULL,
    `typeOfActivity` LONGTEXT NULL,
    `hazardSource` LONGTEXT NULL,
    `risk` LONGTEXT NULL,
    `peopleExposedToRisk` LONGTEXT NULL,
    `riskAssessment` LONGTEXT NULL,
    `residualRisks` LONGTEXT NULL,
    `expectedInjury` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Risk` ADD CONSTRAINT `Risk_questionAnswerId_fkey` FOREIGN KEY (`questionAnswerId`) REFERENCES `QuestionAnswer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TraffikLineControlMeasure` ADD CONSTRAINT `TraffikLineControlMeasure_riskId_fkey` FOREIGN KEY (`riskId`) REFERENCES `Risk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
