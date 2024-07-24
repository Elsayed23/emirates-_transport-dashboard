/*
  Warnings:

  - You are about to drop the column `inspectionTypeId` on the `inspections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `inspections` DROP FOREIGN KEY `inspections_inspectionTypeId_fkey`;

-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `inspectionTypeId`;

-- AlterTable
ALTER TABLE `reports` ADD COLUMN `inspectionTypeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_inspectionTypeId_fkey` FOREIGN KEY (`inspectionTypeId`) REFERENCES `InspectionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
