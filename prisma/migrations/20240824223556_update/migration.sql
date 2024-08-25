-- CreateTable
CREATE TABLE `RootCause` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NoteRootCauses` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NoteRootCauses_AB_unique`(`A`, `B`),
    INDEX `_NoteRootCauses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NoteRootCauses` ADD CONSTRAINT `_NoteRootCauses_A_fkey` FOREIGN KEY (`A`) REFERENCES `Note`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoteRootCauses` ADD CONSTRAINT `_NoteRootCauses_B_fkey` FOREIGN KEY (`B`) REFERENCES `RootCause`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
