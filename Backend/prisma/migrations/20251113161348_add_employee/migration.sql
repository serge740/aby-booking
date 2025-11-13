/*
  Warnings:

  - You are about to drop the column `adminId` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_adminId_fkey`;

-- DropIndex
DROP INDEX `Employee_adminId_fkey` ON `employee`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `adminId`,
    ADD COLUMN `companyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
