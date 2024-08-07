-- DropForeignKey
ALTER TABLE `UserResponse` DROP FOREIGN KEY `UserResponse_trafficLineId_fkey`;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
