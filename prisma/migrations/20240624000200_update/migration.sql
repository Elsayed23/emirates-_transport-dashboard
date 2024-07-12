/*
  Warnings:

  - You are about to drop the column `existingControlMeasures` on the `Risk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Risk` DROP COLUMN `existingControlMeasures`;

-- CreateTable
CREATE TABLE `ControlMeasure` (
    `id` VARCHAR(191) NOT NULL,
    `riskId` VARCHAR(191) NOT NULL,
    `measure` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ControlMeasure` ADD CONSTRAINT `ControlMeasure_riskId_fkey` FOREIGN KEY (`riskId`) REFERENCES `Risk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
