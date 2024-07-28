/*
  Warnings:

  - Added the required column `enDescription` to the `inspections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inspections` ADD COLUMN `enDescription` VARCHAR(191) NOT NULL;
