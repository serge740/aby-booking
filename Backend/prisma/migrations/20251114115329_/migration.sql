-- CreateTable
CREATE TABLE `Leave` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `type` ENUM('VACATION', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'UNPAID', 'COMPASSIONATE') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `reasonForRequest` VARCHAR(191) NULL,
    `attachments` JSON NULL,
    `approvedAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `reasonForRejection` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Leave_companyId_idx`(`companyId`),
    INDEX `Leave_employeeId_idx`(`employeeId`),
    INDEX `Leave_status_idx`(`status`),
    INDEX `Leave_startDate_endDate_idx`(`startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
