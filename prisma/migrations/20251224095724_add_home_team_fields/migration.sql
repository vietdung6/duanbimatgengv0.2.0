-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('user', 'system') NULL DEFAULT 'user',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_session_created`(`session_id`, `created_at`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(64) NOT NULL,
    `created_by_staff_id` INTEGER NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `used_by_user_id` INTEGER NULL,
    `role` ENUM('fan', 'staff') NOT NULL DEFAULT 'fan',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `token`(`token`),
    INDEX `idx_expires_at`(`expires_at`),
    INDEX `idx_token`(`token`),
    INDEX `idx_used`(`used`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tournament_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `logo` TEXT NULL,
    `category` ENUM('MAJOR', 'FRIENDLY') NOT NULL DEFAULT 'MAJOR',
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `tournament_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `home_team_name` VARCHAR(255) NULL DEFAULT 'Gen.G',
    `home_team_logo` VARCHAR(512) NULL,
    `opponent_name` VARCHAR(255) NOT NULL,
    `opponent_logo` VARCHAR(512) NULL,
    `match_date` DATETIME(0) NOT NULL,
    `timezone` VARCHAR(50) NULL DEFAULT 'KST',
    `tournament` VARCHAR(255) NOT NULL,
    `stage` VARCHAR(255) NULL,
    `round_name` VARCHAR(255) NULL,
    `match_type` VARCHAR(50) NULL DEFAULT 'BO3',
    `match_status` ENUM('scheduled', 'finished') NOT NULL DEFAULT 'scheduled',
    `score_gen` INTEGER NULL DEFAULT 0,
    `score_opp` INTEGER NULL DEFAULT 0,
    `match_result` ENUM('win', 'loss', 'draw') NULL,
    `mvp` VARCHAR(255) NULL,
    `vod_url` VARCHAR(512) NULL,
    `patch` VARCHAR(20) NULL,
    `lineup` LONGTEXT NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_matches_date`(`match_date`),
    INDEX `idx_matches_status`(`match_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_games` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `game_number` INTEGER NOT NULL,
    `patch` VARCHAR(20) NULL,
    `side` VARCHAR(10) NULL,
    `result` VARCHAR(10) NULL,
    `gen_bans` JSON NULL,
    `opp_bans` JSON NULL,
    `gen_picks` JSON NULL,
    `opp_picks` JSON NULL,
    `gen_players` JSON NULL,
    `vod_url` VARCHAR(512) NULL,
    `duration` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('point', 'admin', 'notification') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `points_change` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NULL,
    `display_name` VARCHAR(100) NULL,
    `proof` TEXT NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `total_points` INTEGER NOT NULL DEFAULT 0,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('fan', 'staff', 'admin') NULL DEFAULT 'fan',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `avatar_url` VARCHAR(255) NULL,
    `last_daily_pray` DATETIME(0) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viewing_party_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `type` ENUM('quiz', 'prediction', 'check_in', 'poll') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `options` JSON NULL,
    `correct_option_index` INTEGER NULL,
    `points` INTEGER NULL DEFAULT 0,
    `status` ENUM('pending', 'active', 'ended') NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_session`(`session_id`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viewing_party_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `selected_option_index` INTEGER NULL,
    `is_correct` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `event_id`(`event_id`),
    UNIQUE INDEX `unique_user_event`(`user_id`, `event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viewing_session_bans` (
    `session_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `banned_by` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`session_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viewing_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `stream_url` VARCHAR(500) NOT NULL,
    `type` ENUM('online', 'offline') NULL DEFAULT 'online',
    `location` VARCHAR(255) NULL,
    `map_url` VARCHAR(500) NULL,
    `status` ENUM('scheduled', 'live', 'ended') NULL DEFAULT 'scheduled',
    `start_time` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_chat_enabled` BOOLEAN NULL DEFAULT true,
    `slow_mode_duration` INTEGER NULL DEFAULT 0,

    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `logo_url` VARCHAR(512) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opponent_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opponent_group_members` (
    `group_id` INTEGER NOT NULL,
    `team_resource_id` INTEGER NOT NULL,

    PRIMARY KEY (`group_id`, `team_resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tournament_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `year` INTEGER NOT NULL DEFAULT 2025,
    `patch` VARCHAR(20) NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `opponent_group_id` INTEGER NULL,
    `type_id` INTEGER NULL,
    `is_official` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `viewing_sessions`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `match_games` ADD CONSTRAINT `match_games_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_history` ADD CONSTRAINT `user_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `viewing_party_responses` ADD CONSTRAINT `viewing_party_responses_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `viewing_party_events`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `viewing_party_responses` ADD CONSTRAINT `viewing_party_responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `viewing_session_bans` ADD CONSTRAINT `viewing_session_bans_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `viewing_sessions`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `viewing_session_bans` ADD CONSTRAINT `viewing_session_bans_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `viewing_sessions` ADD CONSTRAINT `viewing_sessions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `opponent_group_members` ADD CONSTRAINT `opponent_group_members_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `opponent_groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opponent_group_members` ADD CONSTRAINT `opponent_group_members_team_resource_id_fkey` FOREIGN KEY (`team_resource_id`) REFERENCES `team_resources`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_resources` ADD CONSTRAINT `tournament_resources_opponent_group_id_fkey` FOREIGN KEY (`opponent_group_id`) REFERENCES `opponent_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_resources` ADD CONSTRAINT `tournament_resources_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `tournament_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
