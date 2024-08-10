/*
  Warnings:

  - Added the required column `updatedAt` to the `Built` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Built` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Built` ADD CONSTRAINT `Built_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
