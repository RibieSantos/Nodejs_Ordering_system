-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2024 at 05:51 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_endterm`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `menu_image` varchar(100) NOT NULL,
  `menu_title` varchar(50) NOT NULL,
  `menu_price` decimal(8,2) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `menu_image`, `menu_title`, `menu_price`, `menu_id`, `id`, `quantity`, `total_price`) VALUES
(1, '1704261691568-lockscreen.jpg', 'Hotdog with kunting rice', '180.00', 29, 6, 1, 180),
(2, '1704261745841-HD-wallpaper-baltic-coast-of-germany-rugen-windows.jpg', 'Adobow with medyo madaming rice', '100.00', 30, 6, 10, 1000),
(3, '1704261707087-134-1345941_lion-hd-wallpapers-good-morning-stay-positive.jpg', 'Arjay', '90.00', 28, 7, 2, 180),
(4, '1704261691568-lockscreen.jpg', 'Hotdog with kunting rice', '180.00', 29, 6, 1, 180),
(5, '1704635345931-yeartext.jpg', 'Wahaha', '90.00', 31, 6, 9, 810);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `cat_id` int(11) NOT NULL,
  `cat_title` varchar(50) NOT NULL,
  `cat_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`cat_id`, `cat_title`, `cat_desc`) VALUES
(2, 'Beverage', 'Uhaw na uhaw kana!'),
(3, 'Breakfast', 'Don\t break your fast'),
(4, 'Lunch', 'Kain ka din ng lunch'),
(5, 'Dinner', 'Mag dinner ka din uy'),
(6, 'Dessert', 'Huwaw!');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `menu_image` varchar(100) NOT NULL,
  `menu_title` varchar(50) NOT NULL,
  `menu_desc` varchar(255) NOT NULL,
  `menu_price` decimal(8,2) NOT NULL,
  `menu_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `cat_id`, `menu_image`, `menu_title`, `menu_desc`, `menu_price`, `menu_status`) VALUES
(28, 2, '1704261707087-134-1345941_lion-hd-wallpapers-good-morning-stay-positive.jpg', 'Arjay', 'Descp', '90.00', 'Available'),
(29, 3, '1704261691568-lockscreen.jpg', 'Hotdog with kunting rice', 'Huwaw', '180.00', 'Available'),
(30, 4, '1704261745841-HD-wallpaper-baltic-coast-of-germany-rugen-windows.jpg', 'Adobow with medyo madaming rice', 'Amoy palang tuyo na', '100.00', 'Available'),
(31, 6, '1704635345931-yeartext.jpg', 'Wahaha', 'Masarap Siya!1', '90.00', 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_amount` float NOT NULL,
  `order_date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `ord_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_title` varchar(50) NOT NULL,
  `menu_price` decimal(8,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` float NOT NULL,
  `ord_date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `birthdate` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `gender`, `birthdate`, `email`, `password`, `user_type`) VALUES
(1, 'Admin Administrator', 'Male', '03-14-2002', 'admin@gmail.com', '$2b$10$d1TPuNUTefWBsh0V9nH/v.PEctAGTv9/U9X7iPrn7m3uokoqGYjfG', 'admin'),
(5, 'ribie santos', 'Male', '12-43-2332', 'c@g.c', '$2b$10$d1TPuNUTefWBsh0V9nH/v.PEctAGTv9/U9X7iPrn7m3uokoqGYjfG', 'customer'),
(6, 'Arjay Lalas', 'Male', '2024-01-02', 'arjay@gmail.com', '$2b$10$7YliMzcpv/OnJBPqkzdL5OhxE2GusGNbvKsK9F/FQdggRLY2TvZvy', 'customer'),
(7, 'Francis', 'Male', '2024-01-19', 'francis@gmail.com', '$2b$10$7Lt414pLvm4tMNhgMlcY9uxrA9Hl1Nb/rpKU31jXQGFHZ6HUR3OKy', 'customer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`ord_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `ord_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;