/*
  Warnings:

  - You are about to drop the column `activity` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `causeOfRisk` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `expectedInjury` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `hazardSource` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `peopleExposedToRisk` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `residualRisks` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `risk` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `riskAssessment` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfActivity` on the `TrafficLineRisk` table. All the data in the column will be lost.
  - You are about to drop the column `riskId` on the `TraffikLineControlMeasure` table. All the data in the column will be lost.
  - Added the required column `questionAnswerId` to the `TraffikLineControlMeasure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TraffikLineControlMeasure` DROP FOREIGN KEY `TraffikLineControlMeasure_riskId_fkey`;

-- AlterTable
ALTER TABLE `TrafficLineRisk` DROP COLUMN `activity`,
    DROP COLUMN `causeOfRisk`,
    DROP COLUMN `expectedInjury`,
    DROP COLUMN `hazardSource`,
    DROP COLUMN `peopleExposedToRisk`,
    DROP COLUMN `questionId`,
    DROP COLUMN `residualRisks`,
    DROP COLUMN `risk`,
    DROP COLUMN `riskAssessment`,
    DROP COLUMN `typeOfActivity`;

-- AlterTable
ALTER TABLE `TraffikLineControlMeasure` DROP COLUMN `riskId`,
    ADD COLUMN `questionAnswerId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `QuestionAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `trafficLineRiskId` VARCHAR(191) NULL,
    `questionId` INTEGER NOT NULL,
    `question` LONGTEXT NOT NULL,
    `translatedQuestion` LONGTEXT NOT NULL,
    `answer` LONGTEXT NOT NULL,
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
ALTER TABLE `QuestionAnswer` ADD CONSTRAINT `QuestionAnswer_trafficLineRiskId_fkey` FOREIGN KEY (`trafficLineRiskId`) REFERENCES `TrafficLineRisk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TraffikLineControlMeasure` ADD CONSTRAINT `TraffikLineControlMeasure_questionAnswerId_fkey` FOREIGN KEY (`questionAnswerId`) REFERENCES `QuestionAnswer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
