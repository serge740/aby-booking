/*
  Warnings:

  - You are about to drop the column `categoryId` on the `menuitem` table. All the data in the column will be lost.
  - You are about to drop the `menucategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `menuitem` DROP COLUMN `categoryId`,
    ADD COLUMN `stockId` VARCHAR(191) NULL,
    ADD COLUMN `tags` JSON NOT NULL;

-- DropTable
DROP TABLE `menucategory`;
