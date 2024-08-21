-- DropForeignKey
ALTER TABLE `UserResponse` DROP FOREIGN KEY `UserResponse_questionId_fkey`;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
