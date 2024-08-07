/*
  Warnings:

  - You are about to drop the `_TrafficLineToUserResponse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `trafficLineId` to the `UserResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_TrafficLineToUserResponse` DROP FOREIGN KEY `_TrafficLineToUserResponse_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TrafficLineToUserResponse` DROP FOREIGN KEY `_TrafficLineToUserResponse_B_fkey`;

-- AlterTable
ALTER TABLE `UserResponse` ADD COLUMN `trafficLineId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_TrafficLineToUserResponse`;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
