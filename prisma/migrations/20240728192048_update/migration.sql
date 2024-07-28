-- DropForeignKey
ALTER TABLE `DeleteRequest` DROP FOREIGN KEY `DeleteRequest_inspectionId_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolControlMeasure` DROP FOREIGN KEY `SchoolControlMeasure_riskId_fkey`;

-- AddForeignKey
ALTER TABLE `DeleteRequest` ADD CONSTRAINT `DeleteRequest_inspectionId_fkey` FOREIGN KEY (`inspectionId`) REFERENCES `inspections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolControlMeasure` ADD CONSTRAINT `SchoolControlMeasure_riskId_fkey` FOREIGN KEY (`riskId`) REFERENCES `SchoolRisks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
