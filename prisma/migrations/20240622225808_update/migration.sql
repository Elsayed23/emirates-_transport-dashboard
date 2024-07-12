/*
  Warnings:

  - The primary key for the `Risk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrafficLine` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Risk` DROP FOREIGN KEY `Risk_trafficLineId_fkey`;

-- AlterTable
ALTER TABLE `Risk` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `trafficLineId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TrafficLine` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Risk` ADD CONSTRAINT `Risk_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
