-- CreateTable
CREATE TABLE `CompanyNotification` (
    `id` VARCHAR(191) NOT NULL,
    `recipients` JSON NOT NULL,
    `senderId` VARCHAR(191) NULL,
    `senderType` ENUM('COMPANY', 'EMPLOYEE') NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
