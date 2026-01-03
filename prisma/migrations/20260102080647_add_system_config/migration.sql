/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `matches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `matches` ADD COLUMN `slug` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `system_configs` (
    `key` VARCHAR(50) NOT NULL,
    `value` TEXT NOT NULL,
    `description` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `matches_slug_key` ON `matches`(`slug`);
