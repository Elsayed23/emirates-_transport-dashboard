/*
  Warnings:

  - You are about to drop the column `measureAr` on the `SchoolControlMeasure` table. All the data in the column will be lost.
  - You are about to drop the column `measureEn` on the `SchoolControlMeasure` table. All the data in the column will be lost.
  - Added the required column `ar` to the `SchoolControlMeasure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `en` to the `SchoolControlMeasure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SchoolControlMeasure` DROP COLUMN `measureAr`,
    DROP COLUMN `measureEn`,
    ADD COLUMN `ar` LONGTEXT NOT NULL,
    ADD COLUMN `en` LONGTEXT NOT NULL;
