-- AlterTable
ALTER TABLE `TrafficLine` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TrafficLine` ADD CONSTRAINT `TrafficLine_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
