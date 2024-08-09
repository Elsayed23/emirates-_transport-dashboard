-- AlterTable
ALTER TABLE `UserResponse` ADD COLUMN `buildId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Built` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cityName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Built`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
