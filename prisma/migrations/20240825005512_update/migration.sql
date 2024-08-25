/*
  Warnings:

  - You are about to drop the `_NoteCorrectiveAction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `noteId` to the `CorrectiveAction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_NoteCorrectiveAction` DROP FOREIGN KEY `_NoteCorrectiveAction_A_fkey`;

-- DropForeignKey
ALTER TABLE `_NoteCorrectiveAction` DROP FOREIGN KEY `_NoteCorrectiveAction_B_fkey`;

-- AlterTable
ALTER TABLE `CorrectiveAction` ADD COLUMN `noteId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_NoteCorrectiveAction`;

-- AddForeignKey
ALTER TABLE `CorrectiveAction` ADD CONSTRAINT `CorrectiveAction_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
