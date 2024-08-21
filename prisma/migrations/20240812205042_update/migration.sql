-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_requirementId_fkey`;

-- DropForeignKey
ALTER TABLE `Requirement` DROP FOREIGN KEY `Requirement_inspectionTypeId_fkey`;

-- AddForeignKey
ALTER TABLE `Requirement` ADD CONSTRAINT `Requirement_inspectionTypeId_fkey` FOREIGN KEY (`inspectionTypeId`) REFERENCES `InspectionType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `Requirement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
