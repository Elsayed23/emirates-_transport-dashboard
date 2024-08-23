/*
  Warnings:

  - You are about to drop the column `user_id` on the `reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_user_id_fkey`;

-- AlterTable
ALTER TABLE `Built` ADD COLUMN `userFinancialNumber` VARCHAR(191) NULL,
    ADD COLUMN `userName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `TrafficLine` ADD COLUMN `userFinancialNumber` VARCHAR(191) NULL,
    ADD COLUMN `userName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reports` DROP COLUMN `user_id`,
    ADD COLUMN `userFinancialNumber` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL,
    ADD COLUMN `userName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
