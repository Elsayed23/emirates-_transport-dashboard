-- CreateTable
CREATE TABLE `TrafficLineImage` (
    `id` VARCHAR(191) NOT NULL,
    `trafficLineId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrafficLineImage` ADD CONSTRAINT `TrafficLineImage_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
