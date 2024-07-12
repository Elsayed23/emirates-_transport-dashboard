-- CreateTable
CREATE TABLE `TrafficLine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `stationId` INTEGER NOT NULL,
    `stationName` VARCHAR(191) NOT NULL,
    `educationalLevel` VARCHAR(191) NOT NULL,
    `countOfStudents` INTEGER NOT NULL,
    `transferredCategory` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Risk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trafficLineId` INTEGER NULL,
    `No` INTEGER NULL,
    `causeOfRisk` VARCHAR(191) NULL,
    `activity` VARCHAR(191) NULL,
    `typeOfActivity` VARCHAR(191) NULL,
    `hazardSource` VARCHAR(191) NULL,
    `risk` VARCHAR(191) NULL,
    `peopleExposedToRisk` VARCHAR(191) NULL,
    `expectedInjury` VARCHAR(191) NULL,
    `LR` VARCHAR(191) NULL,
    `riskAssessment` VARCHAR(191) NULL,
    `existingControlMeasures` VARCHAR(191) NULL,
    `residualRisk` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Risk` ADD CONSTRAINT `Risk_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
