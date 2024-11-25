-- --------------------------------------------------------

--
-- Table Structure for table `profiles`.
--
-- DROP TABLE IF EXISTS `profiles`;

CREATE TABLE IF NOT EXISTS `profiles` (
    `id` varchar(100) NOT NULL,
    `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
    `status` varchar(100) DEFAULT NULL,
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Indices de una tabla recién creada
--

ALTER TABLE `profiles` DROP INDEX `PRIMARY`;

ALTER TABLE `profiles` ADD PRIMARY KEY (`id`);