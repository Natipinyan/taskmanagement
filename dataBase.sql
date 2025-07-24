-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2025 at 06:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
                              `id` int(11) NOT NULL,
                              `user_id` int(11) NOT NULL,
                              `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`) VALUES
                                                       (1, 1, 'ספורט'),
                                                       (2, 1, 'לימודים'),
                                                       (3, 2, 'ספורט'),
                                                       (4, 2, 'ארגון');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
                         `id` int(11) NOT NULL,
                         `user_id` int(11) NOT NULL,
                         `category_id` int(11) DEFAULT NULL,
                         `description` varchar(200) NOT NULL,
                         `date` date DEFAULT NULL,
                         `done` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `category_id`, `description`, `date`, `done`) VALUES
                                                                                        (1, 1, 1, 'ריצה של 5 קילומטרים', '2025-07-26', 1),
                                                                                        (2, 1, 1, 'אימון כוח כללי', '2025-08-27', 1),
                                                                                        (3, 1, 1, 'שיעור יוגה', '2025-10-23', 0),
                                                                                        (4, 1, 1, 'חדר כושר', '2025-07-24', 1),
                                                                                        (5, 1, 1, 'שחייה', '2025-09-18', 0),
                                                                                        (6, 1, 1, 'אימון ריצה אינטרוולים', '2025-08-12', 0),
                                                                                        (7, 1, 1, 'קפיצה בחבל', '2025-08-04', 0),
                                                                                        (8, 1, 1, 'טיפוס על קירות', '2025-08-13', 0),
                                                                                        (9, 1, 2, 'סיכום חומר לקריאת ספר', '2025-07-24', 1),
                                                                                        (10, 1, 2, 'הכנת מצגת על נושא לימודי', '2025-08-08', 0),
                                                                                        (11, 1, 2, 'תרגול שאלות מקורס', '2025-07-16', 0),
                                                                                        (12, 2, 3, 'טניס', '2025-07-17', 0),
                                                                                        (13, 2, 4, 'סידור משרד', '2025-07-24', 1),
                                                                                        (14, 2, 4, 'סידור חדר עבודה', '2025-08-15', 0),
                                                                                        (15, 2, 4, 'קניות', '2025-08-12', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
                         `id` int(11) NOT NULL,
                         `name` varchar(100) NOT NULL,
                         `uname` varchar(100) NOT NULL,
                         `passwd` varchar(100) NOT NULL,
                         `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `uname`, `passwd`, `email`) VALUES
                                                                   (1, 'nati pinyan', 'nati', '613d0bcb49f537779cad00167686c4a2', 'natipinyan@gmail.com'),
                                                                   (2, 'avi', 'avi', '52b3391c7242980f692023eca62928c7', 'avi@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
    ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
