/*
  Warnings:

  - You are about to drop the column `description` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `enDescription` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `noteClassification` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `requirement` on the `inspections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `description`,
    DROP COLUMN `enDescription`,
    DROP COLUMN `noteClassification`,
    DROP COLUMN `requirement`,
    ADD COLUMN `noteId` VARCHAR(191) NULL,
    ADD COLUMN `requirementId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `Requirement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
