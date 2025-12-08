-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentMethod` ENUM('MOMO', 'CASH') NOT NULL DEFAULT 'CASH';
