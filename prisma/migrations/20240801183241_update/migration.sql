/*
  Warnings:

  - You are about to drop the column `stationName` on the `TrafficLine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TrafficLine` DROP COLUMN `stationName`,
    MODIFY `stationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TrafficLine` ADD CONSTRAINT `TrafficLine_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
