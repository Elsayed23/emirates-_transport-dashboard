/*
  Warnings:

  - You are about to drop the column `attachment` on the `inspections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Role` MODIFY `name` ENUM('ADMIN', 'SAFETY_MANAGER', 'SAFETY_DIRECTOR', 'OPERATIONS_MANAGER', 'SAFETY_OFFICER') NOT NULL;

-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `attachment`;

-- CreateTable
CREATE TABLE `InspectionAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InspectionAttachment` ADD CONSTRAINT `InspectionAttachment_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
