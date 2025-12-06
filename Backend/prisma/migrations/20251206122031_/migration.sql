/*
  Warnings:

  - You are about to drop the column `momoCode` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `momoCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `momoCode`;
