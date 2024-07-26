-- AlterTable
ALTER TABLE `SchoolRisks` MODIFY `hazardSource` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `TrafficLineRisk` MODIFY `causeOfRisk` LONGTEXT NULL,
    MODIFY `hazardSource` LONGTEXT NULL;
