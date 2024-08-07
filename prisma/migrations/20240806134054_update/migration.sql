/*
  Warnings:

  - You are about to drop the `QuestionAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrafficLineRisk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TraffikLineControlMeasure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuestionAnswer` DROP FOREIGN KEY `QuestionAnswer_trafficLineRiskId_fkey`;

-- DropForeignKey
ALTER TABLE `TrafficLineRisk` DROP FOREIGN KEY `TrafficLineRisk_trafficLineId_fkey`;

-- DropForeignKey
ALTER TABLE `TraffikLineControlMeasure` DROP FOREIGN KEY `TraffikLineControlMeasure_questionAnswerId_fkey`;

-- DropTable
DROP TABLE `QuestionAnswer`;

-- DropTable
DROP TABLE `TrafficLineRisk`;

-- DropTable
DROP TABLE `TraffikLineControlMeasure`;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `question` LONGTEXT NOT NULL,
    `translatedQuestion` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `Answer_questionId_key`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserResponse` (
    `id` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `response` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControlMeasure` (
    `id` VARCHAR(191) NOT NULL,
    `ar` LONGTEXT NOT NULL,
    `en` LONGTEXT NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TrafficLineToUserResponse` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TrafficLineToUserResponse_AB_unique`(`A`, `B`),
    INDEX `_TrafficLineToUserResponse_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControlMeasure` ADD CONSTRAINT `ControlMeasure_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `Answer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TrafficLineToUserResponse` ADD CONSTRAINT `_TrafficLineToUserResponse_A_fkey` FOREIGN KEY (`A`) REFERENCES `TrafficLine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TrafficLineToUserResponse` ADD CONSTRAINT `_TrafficLineToUserResponse_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserResponse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
