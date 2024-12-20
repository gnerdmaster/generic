-- --------------------------------------------------------
-- This file was generated by MySQL Workbench
-- You can use the next service to create a new table too.
-- POST http//localhost:8080/tables/new - body {"name": "table_name"}
-- This service is in routes/tables.js
--
-- Table Structure for table `profiles`.
--
DROP TABLE IF EXISTS `profiles`;

CREATE TABLE IF NOT EXISTS `profiles` (
    `id` varchar(100) NOT NULL PRIMARY KEY,
    `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Indices de una tabla recién creada
--