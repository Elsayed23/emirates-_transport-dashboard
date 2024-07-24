-- AlterTable
ALTER TABLE `inspections` ADD COLUMN `inspectionTypeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `InspectionType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `inspectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_inspectionTypeId_fkey` FOREIGN KEY (`inspectionTypeId`) REFERENCES `InspectionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
