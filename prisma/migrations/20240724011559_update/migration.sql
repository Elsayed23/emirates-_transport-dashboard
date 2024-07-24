/*
  Warnings:

  - You are about to drop the column `imageOfCorrectiveAction` on the `inspections` table. All the data in the column will be lost.
  - You are about to drop the column `imageOfRootCause` on the `inspections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inspections` DROP COLUMN `imageOfCorrectiveAction`,
    DROP COLUMN `imageOfRootCause`,
    ADD COLUMN `attachment` VARCHAR(191) NULL;
