/*
  Warnings:

  - Added the required column `schoolId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserResponse` ADD COLUMN `schoolId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
