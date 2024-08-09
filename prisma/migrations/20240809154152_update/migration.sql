/*
  Warnings:

  - You are about to drop the column `buildId` on the `UserResponse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserResponse` DROP FOREIGN KEY `UserResponse_buildId_fkey`;

-- AlterTable
ALTER TABLE `UserResponse` DROP COLUMN `buildId`,
    ADD COLUMN `builtId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_builtId_fkey` FOREIGN KEY (`builtId`) REFERENCES `Built`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
