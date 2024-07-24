-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stationId` INTEGER NULL,
    `roleId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `stationId` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `nameOfStation` VARCHAR(191) NOT NULL,
    `InspectionSite` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `jobTitleOfTheEmployee` VARCHAR(191) NOT NULL,
    `employeeName` VARCHAR(191) NOT NULL,
    `schoolId` INTEGER NULL,
    `nameOfSchool` VARCHAR(191) NULL,
    `enNameOfschool` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspections` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` LONGTEXT NOT NULL,
    `idOfBus` INTEGER NOT NULL,
    `noteClassification` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrafficLine` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `stationId` INTEGER NOT NULL,
    `stationName` VARCHAR(191) NOT NULL,
    `educationalLevel` VARCHAR(191) NOT NULL,
    `countOfStudents` INTEGER NOT NULL,
    `transferredCategory` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Risk` (
    `id` VARCHAR(191) NOT NULL,
    `trafficLineId` VARCHAR(191) NULL,
    `questionId` INTEGER NULL,
    `causeOfRisk` VARCHAR(191) NULL,
    `activity` VARCHAR(191) NULL,
    `typeOfActivity` VARCHAR(191) NULL,
    `hazardSource` VARCHAR(191) NULL,
    `risk` LONGTEXT NULL,
    `peopleExposedToRisk` VARCHAR(191) NULL,
    `riskAssessment` VARCHAR(191) NULL,
    `residualRisks` VARCHAR(191) NULL,
    `expectedInjury` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControlMeasure` (
    `id` VARCHAR(191) NOT NULL,
    `riskId` VARCHAR(191) NOT NULL,
    `measure` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspections` ADD CONSTRAINT `inspections_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Risk` ADD CONSTRAINT `Risk_trafficLineId_fkey` FOREIGN KEY (`trafficLineId`) REFERENCES `TrafficLine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControlMeasure` ADD CONSTRAINT `ControlMeasure_riskId_fkey` FOREIGN KEY (`riskId`) REFERENCES `Risk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
