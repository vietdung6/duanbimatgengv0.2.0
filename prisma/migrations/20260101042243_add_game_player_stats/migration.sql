-- AlterTable
ALTER TABLE `matches` ADD COLUMN `opponent_id` INTEGER NULL,
    ADD COLUMN `opponent_short_name` VARCHAR(20) NULL,
    ADD COLUMN `tournament_resource_id` INTEGER NULL,
    MODIFY `opponent_name` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `team_resources` ADD COLUMN `region` VARCHAR(50) NULL,
    ADD COLUMN `region_id` INTEGER NULL,
    ADD COLUMN `short_name` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `two_factor_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `two_factor_secret` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `game_player_stats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `player_name` VARCHAR(100) NULL,
    `role` VARCHAR(20) NOT NULL,
    `team` VARCHAR(10) NOT NULL,
    `champion` VARCHAR(50) NOT NULL,
    `kills` INTEGER NOT NULL DEFAULT 0,
    `deaths` INTEGER NOT NULL DEFAULT 0,
    `assists` INTEGER NOT NULL DEFAULT 0,
    `cs` INTEGER NOT NULL DEFAULT 0,
    `gold` INTEGER NOT NULL DEFAULT 0,
    `summoner1` VARCHAR(30) NULL,
    `summoner2` VARCHAR(30) NULL,
    `damage_dealt` INTEGER NULL DEFAULT 0,
    `damage_taken` INTEGER NULL DEFAULT 0,

    INDEX `game_player_stats_game_id_fkey`(`game_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `regions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `squad_presets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `top` VARCHAR(100) NULL,
    `jungle` VARCHAR(100) NULL,
    `mid` VARCHAR(100) NULL,
    `ad` VARCHAR(100) NULL,
    `support` VARCHAR(100) NULL,
    `coach` VARCHAR(100) NULL,
    `sub` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ign` VARCHAR(100) NOT NULL,
    `real_name` VARCHAR(255) NULL,
    `role` ENUM('TOP', 'JUNGLE', 'MID', 'AD', 'SUPPORT', 'COACH', 'SUB') NOT NULL,
    `image_url` VARCHAR(512) NULL,
    `nationality` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `join_date` DATE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_matches_tournament_resource` ON `matches`(`tournament_resource_id`);

-- CreateIndex
CREATE INDEX `idx_matches_opponent` ON `matches`(`opponent_id`);

-- CreateIndex
CREATE INDEX `idx_matches_status_date` ON `matches`(`match_status`, `match_date`);

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_opponent_id_fkey` FOREIGN KEY (`opponent_id`) REFERENCES `team_resources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_tournament_resource_id_fkey` FOREIGN KEY (`tournament_resource_id`) REFERENCES `tournament_resources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_player_stats` ADD CONSTRAINT `game_player_stats_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `match_games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_resources` ADD CONSTRAINT `team_resources_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
