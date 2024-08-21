/*
  Warnings:

  - You are about to drop the column `count` on the `Task` table. All the data in the column will be lost.
  - Added the required column `taskCount` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `count`,
    ADD COLUMN `completedCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `taskCount` INTEGER NOT NULL;
