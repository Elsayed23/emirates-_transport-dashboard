/*
  Warnings:

  - Added the required column `orderd` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `ControlMeasure` DROP FOREIGN KEY `ControlMeasure_answerId_fkey`;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `orderd` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControlMeasure` ADD CONSTRAINT `ControlMeasure_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `Answer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
