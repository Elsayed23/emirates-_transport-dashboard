-- DropForeignKey
ALTER TABLE `TrafficLineRisk` DROP FOREIGN KEY `TrafficLineRisk_trafficLineId_fkey`;

-- DropForeignKey
ALTER TABLE `TraffikLineControlMeasure` DROP FOREIGN KEY `TraffikLineControlMeasure_riskId_fkey`;

-- DropForeignKey
ALTER TABLE `inspections` DROP FOREIGN KEY `inspections_reportId_fkey`;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrafficLineRisk` ADD CONSTRAINT `TrafficLineRisk_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TraffikLineControlMeasure` ADD CONSTRAINT `TraffikLineControlMeasure_riskId_fkey` FOREIGN KEY (`riskId`) REFERENCES `TrafficLineRisk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
