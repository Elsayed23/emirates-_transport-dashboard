-- AlterTable
ALTER TABLE `inspections` ADD COLUMN `correctiveAction` VARCHAR(191) NULL,
    ADD COLUMN `imageOfCorrectiveAction` LONGTEXT NULL,
    ADD COLUMN `imageOfRootCause` LONGTEXT NULL,
    ADD COLUMN `isClosed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rootCause` VARCHAR(191) NULL;
