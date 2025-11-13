-- DropForeignKey
ALTER TABLE `menuitem` DROP FOREIGN KEY `MenuItem_companyId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_companyId_fkey` ON `menuitem`;

-- AlterTable
ALTER TABLE `menuitem` MODIFY `companyId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `date_of_birth` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `national_id` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NULL,
    `bank_account_number` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `cv` VARCHAR(191) NULL,
    `application_letter` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NULL DEFAULT 'SINGLE',
    `date_hired` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'TERMINATED', 'RESIGNED', 'PROBATION') NOT NULL DEFAULT 'ACTIVE',
    `experience` JSON NULL,
    `emergency_contact_name` VARCHAR(191) NULL,
    `emergency_contact_phone` VARCHAR(191) NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `google_id` VARCHAR(191) NULL,
    `isLocked` BOOLEAN NULL DEFAULT false,
    `is2FA` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_id_key`(`id`),
    UNIQUE INDEX `Employee_email_key`(`email`),
    UNIQUE INDEX `Employee_national_id_key`(`national_id`),
    UNIQUE INDEX `Employee_google_id_key`(`google_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
