/*
  Warnings:

  - You are about to drop the column `enNameOfschool` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `nameOfSchool` on the `reports` table. All the data in the column will be lost.
  - Added the required column `schoolId` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reports` DROP COLUMN `enNameOfschool`,
    DROP COLUMN `nameOfSchool`,
    ADD COLUMN `schoolId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
