-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 03:45 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `catering_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ipAddress` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `userId`, `action`, `module`, `description`, `ipAddress`, `createdAt`) VALUES
(1, 2, 'LOGIN', 'AUTH', 'User Super Admin login ke sistem', NULL, '2025-11-26 06:29:11.622'),
(2, 2, 'CREATE', 'ORDER_IN', 'Super Admin menambah pesanan masuk: ORD-IN-251126-8728 untuk Jhoqhowy', NULL, '2025-11-26 06:32:47.701'),
(3, 2, 'CREATE', 'INCOME', 'Super Admin menambah pemasukan: asdafsf - Rp 26000', NULL, '2025-11-26 09:28:53.986'),
(4, 2, 'CREATE', 'EXPENSE', 'Super Admin menambah pengeluaran: beli beras 1 kg - Rp 20000', NULL, '2025-11-26 09:29:46.918'),
(5, 2, 'LOGOUT', 'AUTH', 'User Super Admin logout dari sistem', NULL, '2025-11-26 09:30:30.393'),
(6, 4, 'LOGIN', 'AUTH', 'User Admin Customer Service login ke sistem', NULL, '2025-11-26 09:30:58.040'),
(7, 4, 'LOGOUT', 'AUTH', 'User Admin Customer Service logout dari sistem', NULL, '2025-11-26 09:31:34.153'),
(8, 1, 'LOGIN', 'AUTH', 'User Pemilik Catering login ke sistem', NULL, '2025-11-26 09:31:49.250'),
(9, 1, 'LOGOUT', 'AUTH', 'User Pemilik Catering logout dari sistem', NULL, '2025-11-26 09:33:01.296'),
(10, 3, 'LOGIN', 'AUTH', 'User Admin Keuangan login ke sistem', NULL, '2025-11-26 09:33:19.846'),
(11, 3, 'LOGOUT', 'AUTH', 'User Admin Keuangan logout dari sistem', NULL, '2025-11-26 09:33:48.942'),
(12, 5, 'LOGIN', 'AUTH', 'User Admin Menu login ke sistem', NULL, '2025-11-26 09:33:55.899'),
(13, 5, 'LOGOUT', 'AUTH', 'User Admin Menu logout dari sistem', NULL, '2025-11-26 09:34:35.723'),
(14, 6, 'LOGIN', 'AUTH', 'User Admin SDM login ke sistem', NULL, '2025-11-26 09:34:52.828'),
(15, 6, 'LOGOUT', 'AUTH', 'User Admin SDM logout dari sistem', NULL, '2025-11-26 12:06:26.260'),
(16, 2, 'LOGIN', 'AUTH', 'User Super Admin login ke sistem', NULL, '2025-11-26 12:07:13.364'),
(17, 2, 'UPDATE', 'ORDER_IN', 'Super Admin mengubah pesanan masuk: ORD-IN-251126-8728', NULL, '2025-11-26 12:09:03.440'),
(18, 2, 'UPDATE', 'ORDER_IN', 'Super Admin mengubah pesanan masuk: ORD-IN-251126-8728', NULL, '2025-11-26 12:09:26.451'),
(19, 2, 'LOGOUT', 'AUTH', 'User Super Admin logout dari sistem', NULL, '2025-11-26 12:11:06.629'),
(20, 3, 'LOGIN', 'AUTH', 'User Admin Keuangan login ke sistem', NULL, '2025-11-26 12:11:29.468'),
(21, 3, 'LOGOUT', 'AUTH', 'User Admin Keuangan logout dari sistem', NULL, '2025-11-26 12:13:04.393'),
(22, 5, 'LOGIN', 'AUTH', 'User Admin Menu login ke sistem', NULL, '2025-11-26 12:13:28.533'),
(23, 5, 'UPDATE', 'INGREDIENT', 'Admin Menu mengubah bahan: Tepung Terigu', NULL, '2025-11-26 12:21:08.193');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employeeId` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinDate` datetime(3) NOT NULL,
  `salary` decimal(15,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employeeId`, `name`, `email`, `phone`, `address`, `position`, `department`, `joinDate`, `salary`, `status`, `photo`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'EMP001', 'Budi Santoso', 'budi@example.com', '081111111111', 'Jl. Melati No. 1', 'Chef', 'Dapur', '2023-01-15 00:00:00.000', '5000000.00', 'ACTIVE', NULL, NULL, 6, '2025-11-26 06:27:11.021', '2025-11-26 06:27:11.021'),
(2, 'EMP002', 'Siti Rahayu', 'siti@example.com', '081222222222', 'Jl. Mawar No. 2', 'Asisten Chef', 'Dapur', '2023-03-20 00:00:00.000', '3500000.00', 'ACTIVE', NULL, NULL, 6, '2025-11-26 06:27:11.028', '2025-11-26 06:27:11.028'),
(3, 'EMP003', 'Ahmad Hidayat', 'ahmad@example.com', '081333333333', 'Jl. Anggrek No. 3', 'Driver', 'Operasional', '2023-02-10 00:00:00.000', '3000000.00', 'ACTIVE', NULL, NULL, 6, '2025-11-26 06:27:11.030', '2025-11-26 06:27:11.030'),
(4, 'EMP004', 'Dewi Lestari', 'dewi@example.com', '081444444444', 'Jl. Dahlia No. 4', 'Admin', 'Kantor', '2023-04-01 00:00:00.000', '3500000.00', 'ACTIVE', NULL, NULL, 6, '2025-11-26 06:27:11.034', '2025-11-26 06:27:11.034');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `date`, `description`, `amount`, `category`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, '2025-11-26 00:00:00.000', 'beli beras 1 kg', '20000.00', 'Bahan Baku', 'oksdfdsf', 2, '2025-11-26 09:29:46.914', '2025-11-26 09:29:46.914');

-- --------------------------------------------------------

--
-- Table structure for table `incomes`
--

CREATE TABLE `incomes` (
  `id` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incomes`
--

INSERT INTO `incomes` (`id`, `date`, `description`, `amount`, `category`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, '2025-11-26 00:00:00.000', 'asdafsf', '26000.00', 'Pesanan', 'sego pecel', 2, '2025-11-26 09:28:53.967', '2025-11-26 09:28:53.967');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` decimal(15,2) NOT NULL,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minStock` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `supplier` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `category`, `stock`, `unit`, `minStock`, `price`, `supplier`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Beras', 'Bahan Pokok', '100.00', 'kg', '20.00', '12000.00', 'Toko Beras Jaya', NULL, 5, '2025-11-26 06:27:10.995', '2025-11-26 06:27:10.995'),
(2, 'Ayam', 'Protein', '50.00', 'kg', '10.00', '35000.00', 'Peternakan Ayam Sejahtera', NULL, 5, '2025-11-26 06:27:11.002', '2025-11-26 06:27:11.002'),
(3, 'Daging Sapi', 'Protein', '30.00', 'kg', '5.00', '120000.00', 'Pasar Daging Utama', NULL, 5, '2025-11-26 06:27:11.007', '2025-11-26 06:27:11.007'),
(4, 'Minyak Goreng', 'Bahan Pokok', '40.00', 'liter', '10.00', '15000.00', 'Toko Sembako ABC', NULL, 5, '2025-11-26 06:27:11.010', '2025-11-26 06:27:11.010'),
(5, 'Gula Pasir', 'Bahan Pokok', '25.00', 'kg', '5.00', '14000.00', 'Toko Sembako ABC', NULL, 5, '2025-11-26 06:27:11.013', '2025-11-26 06:27:11.013'),
(6, 'Tepung Terigu', 'Bahan Pokok', '1.00', 'kg', '10.00', '10000.00', 'Toko Sembako ABC', '', 5, '2025-11-26 06:27:11.016', '2025-11-26 12:21:08.188');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT 1,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `description`, `category`, `price`, `image`, `isAvailable`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Nasi Kotak Ayam Goreng', 'Nasi kotak dengan lauk ayam goreng, sayur, dan sambal', 'Makanan', '25000.00', NULL, 1, 5, '2025-11-26 06:27:10.967', '2025-11-26 06:27:10.967'),
(2, 'Nasi Kotak Rendang', 'Nasi kotak dengan lauk rendang, sayur, dan sambal', 'Makanan', '30000.00', NULL, 1, 5, '2025-11-26 06:27:10.974', '2025-11-26 06:27:10.974'),
(3, 'Nasi Kotak Ayam Bakar', 'Nasi kotak dengan lauk ayam bakar, sayur, dan sambal', 'Makanan', '28000.00', NULL, 1, 5, '2025-11-26 06:27:10.978', '2025-11-26 06:27:10.978'),
(4, 'Snack Box Standard', 'Kue basah, kue kering, dan minuman', 'Snack', '15000.00', NULL, 1, 5, '2025-11-26 06:27:10.982', '2025-11-26 06:27:10.982'),
(5, 'Snack Box Premium', 'Kue premium, sandwich, dan minuman', 'Snack', '25000.00', NULL, 1, 5, '2025-11-26 06:27:10.986', '2025-11-26 06:27:10.986'),
(6, 'Es Teh Manis', 'Es teh manis segar', 'Minuman', '5000.00', NULL, 1, 5, '2025-11-26 06:27:10.988', '2025-11-26 06:27:10.988'),
(7, 'Air Mineral', 'Air mineral botol', 'Minuman', '4000.00', NULL, 1, 5, '2025-11-26 06:27:10.992', '2025-11-26 06:27:10.992');

-- --------------------------------------------------------

--
-- Table structure for table `orders_in`
--

CREATE TABLE `orders_in` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerPhone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerAddress` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderDate` datetime(3) NOT NULL,
  `deliveryDate` datetime(3) NOT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders_in`
--

INSERT INTO `orders_in` (`id`, `orderNumber`, `customerName`, `customerPhone`, `customerAddress`, `orderDate`, `deliveryDate`, `totalAmount`, `status`, `notes`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'ORD-IN-251126-8728', 'Jhoqhowy', '7897866785768', 'Gubug', '2025-11-20 00:00:00.000', '2025-11-27 00:00:00.000', '20000.00', 'CONFIRMED', 'asdsad', 2, '2025-11-26 06:32:47.691', '2025-11-26 12:09:26.445');

-- --------------------------------------------------------

--
-- Table structure for table `orders_out`
--

CREATE TABLE `orders_out` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerPhone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerAddress` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderDate` datetime(3) NOT NULL,
  `deliveryDate` datetime(3) NOT NULL,
  `completedDate` datetime(3) DEFAULT NULL,
  `totalAmount` decimal(15,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DELIVERED',
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_in_items`
--

CREATE TABLE `order_in_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `menuId` int(11) DEFAULT NULL,
  `menuName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_in_items`
--

INSERT INTO `order_in_items` (`id`, `orderId`, `menuId`, `menuName`, `quantity`, `unitPrice`, `subtotal`, `notes`) VALUES
(5, 1, NULL, 'Snack Box Standard', 1, '15000.00', '15000.00', NULL),
(6, 1, NULL, 'Es Teh Manis', 1, '5000.00', '5000.00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_out_items`
--

CREATE TABLE `order_out_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `menuId` int(11) DEFAULT NULL,
  `menuName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('PEMILIK','SUPER_ADMIN','ADMIN_KEUANGAN','ADMIN_CS','ADMIN_MENU','ADMIN_SDM') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN_CS',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `avatar`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Pemilik Catering', 'pemilik@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567890', 'Jl. Contoh No. 1, Jakarta', NULL, 'PEMILIK', 1, '2025-11-26 06:27:10.929', '2025-11-26 06:27:10.929'),
(2, 'Super Admin', 'superadmin@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567891', 'Jl. Contoh No. 2, Jakarta', NULL, 'SUPER_ADMIN', 1, '2025-11-26 06:27:10.941', '2025-11-26 06:27:10.941'),
(3, 'Admin Keuangan', 'keuangan@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567892', 'Jl. Contoh No. 3, Jakarta', NULL, 'ADMIN_KEUANGAN', 1, '2025-11-26 06:27:10.946', '2025-11-26 06:27:10.946'),
(4, 'Admin Customer Service', 'cs@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567893', 'Jl. Contoh No. 4, Jakarta', NULL, 'ADMIN_CS', 1, '2025-11-26 06:27:10.951', '2025-11-26 06:27:10.951'),
(5, 'Admin Menu', 'menu@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567894', 'Jl. Contoh No. 5, Jakarta', NULL, 'ADMIN_MENU', 1, '2025-11-26 06:27:10.955', '2025-11-26 06:27:10.955'),
(6, 'Admin SDM', 'sdm@catering.com', '$2a$10$zf9dLLa3xG2zlqSb2v0DHOTcG/Ft4XzZo2SYsJyhIhqjD4ZhFwI92', '081234567895', 'Jl. Contoh No. 6, Jakarta', NULL, 'ADMIN_SDM', 1, '2025-11-26 06:27:10.960', '2025-11-26 06:27:10.960');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('5ac33ba3-f647-4f3d-ac1e-06875e26e0ac', 'ee0caa01df4378669fb23448ea454c54ad8631f60b853a27bd2a2e5c0614f40b', '2025-11-26 06:27:03.308', '20251126062702_init', NULL, NULL, '2025-11-26 06:27:02.533', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_userId_fkey` (`userId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_employeeId_key` (`employeeId`),
  ADD KEY `employees_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `incomes`
--
ALTER TABLE `incomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incomes_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ingredients_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menus_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `orders_in`
--
ALTER TABLE `orders_in`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_in_orderNumber_key` (`orderNumber`),
  ADD KEY `orders_in_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `orders_out`
--
ALTER TABLE `orders_out`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_out_orderNumber_key` (`orderNumber`),
  ADD KEY `orders_out_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `order_in_items`
--
ALTER TABLE `order_in_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_in_items_orderId_fkey` (`orderId`);

--
-- Indexes for table `order_out_items`
--
ALTER TABLE `order_out_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_out_items_orderId_fkey` (`orderId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `incomes`
--
ALTER TABLE `incomes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders_in`
--
ALTER TABLE `orders_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders_out`
--
ALTER TABLE `orders_out`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_in_items`
--
ALTER TABLE `order_in_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_out_items`
--
ALTER TABLE `order_out_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `incomes`
--
ALTER TABLE `incomes`
  ADD CONSTRAINT `incomes_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orders_in`
--
ALTER TABLE `orders_in`
  ADD CONSTRAINT `orders_in_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orders_out`
--
ALTER TABLE `orders_out`
  ADD CONSTRAINT `orders_out_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_in_items`
--
ALTER TABLE `order_in_items`
  ADD CONSTRAINT `order_in_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders_in` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_out_items`
--
ALTER TABLE `order_out_items`
  ADD CONSTRAINT `order_out_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders_out` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
