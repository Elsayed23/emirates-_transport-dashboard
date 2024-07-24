/*
  Warnings:

  - You are about to drop the column `employeeName` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitleOfTheEmployee` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reports` DROP COLUMN `employeeName`,
    DROP COLUMN `jobTitleOfTheEmployee`;
