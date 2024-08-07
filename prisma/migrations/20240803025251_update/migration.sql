/*
  Warnings:

  - You are about to alter the column `questionId` on the `SchoolRisks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `SchoolRisks` MODIFY `questionId` INTEGER NOT NULL;
