/*
  Warnings:

  - You are about to drop the `RootCause` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoteRootCauses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_NoteRootCauses` DROP FOREIGN KEY `_NoteRootCauses_A_fkey`;

-- DropForeignKey
ALTER TABLE `_NoteRootCauses` DROP FOREIGN KEY `_NoteRootCauses_B_fkey`;

-- DropTable
DROP TABLE `RootCause`;

-- DropTable
DROP TABLE `_NoteRootCauses`;

-- CreateTable
CREATE TABLE `CorrectiveAction` (
    `id` VARCHAR(191) NOT NULL,
    `ar` VARCHAR(191) NOT NULL,
    `en` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NoteCorrectiveAction` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NoteCorrectiveAction_AB_unique`(`A`, `B`),
    INDEX `_NoteCorrectiveAction_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NoteCorrectiveAction` ADD CONSTRAINT `_NoteCorrectiveAction_A_fkey` FOREIGN KEY (`A`) REFERENCES `CorrectiveAction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoteCorrectiveAction` ADD CONSTRAINT `_NoteCorrectiveAction_B_fkey` FOREIGN KEY (`B`) REFERENCES `Note`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
