/*
  Warnings:

  - Added the required column `updatedAt` to the `RequisitionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requisition` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `completedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `requisitionitem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `receivedQty` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `receivingStatus` ENUM('NOT_RECEIVED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED') NOT NULL DEFAULT 'NOT_RECEIVED',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `ReceivingLog` (
    `id` VARCHAR(191) NOT NULL,
    `requisitionItemId` VARCHAR(191) NOT NULL,
    `receivedQty` DOUBLE NOT NULL,
    `receivedById` VARCHAR(191) NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
