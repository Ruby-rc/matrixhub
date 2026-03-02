CREATE TABLE IF NOT EXISTS `projects`
(
    `id`           int          NOT NULL AUTO_INCREMENT,
    `name`         varchar(64)  DEFAULT "",
    `type`         tinyint      NOT NULL DEFAULT 0 ,
    `registry_id`  int          DEFAULT NULL,
    `created_at`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `name` (`name`)
) ENGINE = InnoDb DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
    `id` varchar(36) NOT NULL,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL default "",
    `email` varchar(255) NOT NULL default "",
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `roles`
(
    `id`           int         NOT NULL AUTO_INCREMENT,
    `name`         varchar(64) NOT NULL,
    `display_name` varchar(64) NOT NULL,
    `permissions`  text        NOT NULL,
    `scope`        varchar(64) NOT NULL,
    `created_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `members_roles_projects` (
    `id`            int NOT NULL AUTO_INCREMENT,
    `member_id`   varchar(64) NOT NULL,
    `member_type`   varchar(64) NOT NULL,
    `role_id`     varchar(64) NOT NULL,
    `project_id`     int NOT NULL,
    `created_at`    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `project_id_index` (`project_id`),
    UNIQUE KEY `composite_index` (`member_id`,`member_type`,`role_id`, `project_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `models`
(
    `id`           int         NOT NULL AUTO_INCREMENT,
    `name`         varchar(64) NOT NULL,
    `project_id`   int NOT NULL,
    `created_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `datasets`
(
    `id`           int         NOT NULL AUTO_INCREMENT,
    `name`         varchar(64) NOT NULL,
    `project_id`   int NOT NULL,
    `created_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `registries`
(
    `id`              int          NOT NULL AUTO_INCREMENT,
    `name`            varchar(64)  NOT NULL,
    `description`     text         NOT NULL,
    `type`            varchar(64)  NOT NULL, -- registry provider (huggingface, etc.)
    `url`             varchar(255) NOT NULL,
    `credential_type` varchar(255) DEFAULT NULL, -- ('basic', 'oauth', 'secret')
    `auth_info`       text,
    `insecure`        tinyint(1)   NOT NULL DEFAULT '0', -- skip SSL verification (0 for False, 1 for True)
    `status`          int          NOT NULL, -- status (healthy, unhealthy, unknown)
    `created_at`      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `access_tokens`
(
    `id`           int         NOT NULL AUTO_INCREMENT,
    `name`         varchar(64) NOT NULL,
    `secret`       VARCHAR(128),
    `user_id`      CHAR(36)     NOT NULL,
    `created_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   timestamp   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
