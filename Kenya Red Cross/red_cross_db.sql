-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 07:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `red_cross_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `admin_id` varchar(100) NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`admin_id`, `createdAt`, `email`, `fullName`, `role`) VALUES
('EZcCTDd1ZXSYSiCgGzXlubv17XJ3', '2024-10-11T13:22:14.260Z', 'adminx@gmail.com', 'admin', 'administrator'),
('jznL95qAyldh3QEKdKKeSLt6iRm2', '2025-01-26T10:30:06.079Z', 'adminx2@gmail.com', 'Administration ', 'administrator'),
('OpJ3IXx0OoPd773cenW714UJQeh1', '2024-10-06T07:32:17.636Z', 'admin5@gmail.com', 'Mercy Rael', 'administrator'),
('qYB9t0OtK1UjN4Vdh3nVveMBSh63', '2024-10-11T13:30:30.764Z', 'melvin@gmail.com', 'Melvin shem', 'administrator'),
('sIcmoVekIjTTeh15lmJuAaXION93', '2024-10-16T16:02:14.729Z', 'administration@gmail.com', 'Administration ', 'administrator'),
('ZKWNQ1vxXEOiaHllpwTUZfdMQ0W2', '2024-10-24T02:56:35.962Z', 'admin1@gmail.com', 'Administration ', 'administrator');

-- --------------------------------------------------------

--
-- Table structure for table `borrowedequipments`
--

CREATE TABLE `borrowedequipments` (
  `equipment_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `borrow_date` bigint(20) DEFAULT NULL,
  `return_date` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contactusmessages`
--

CREATE TABLE `contactusmessages` (
  `message_key` varchar(50) NOT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userId` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_key` varchar(50) NOT NULL,
  `certification_status` varchar(10) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `fees` int(11) DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `image_link` text DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_key`, `certification_status`, `description`, `duration`, `fees`, `id`, `image_link`, `title`) VALUES
('course1', 'yes', 'Learn the basics of first aid, including how to respond to common injuries.', '24 Days', 1200, '101', 'https://tse1.mm.bing.net/th?id=OIP.m9yBcZHe6wFh8DzJzcZqEAHaEP&pid=Api&P=0&h=220', 'Basic First Aid'),
('course3', 'yes', 'Prepare for natural and man-made disasters with essential survival skills.', '4 hours', 3500, '103', 'https://tse2.mm.bing.net/th?id=OIP.CQ90nXRWgXRem7MZCTwFsAHaHa&pid=Api&P=0&h=220', 'Disaster Preparedness'),
('course4', 'yes', 'Learn how to prevent and respond to fire emergencies in different settings.', '1.5 hours', 1259, '104', 'https://tse3.mm.bing.net/th?id=OIP.OtPwEa_gNNSBLtz6ykL37wHaE8&pid=Api&P=0&h=220', 'Fire Safety'),
('course5', 'yes', 'Gain skills to support individuals facing mental health challenges.', '3 hours', 3434, '105', 'https://tse4.mm.bing.net/th?id=OIP.cmAFQUGCFLEMJCO7GrhLUAHaE8&pid=Api&P=0&h=220', 'Mental Health First Aid'),
('course6', 'yes', 'Learn lifesaving techniques for water-based emergencies.', '5 hours', 3200, '106', 'data:image/jpeg;base64,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', 'Water Rescue Techniques'),
('course7', 'yes', 'Advanced training for individuals to provide first response in emergencies.', '6 hours', 7500, '107', 'https://tse1.mm.bing.net/th?id=OIP.Tdit6WnWacUJgNfLIjORkQHaFN&pid=Api&P=0&h=220', 'First Responder Training'),
('course8', 'yes', 'Develop leadership skills for coordinating and managing volunteers.', '2.5 hours', 1234, '108', 'https://tse3.mm.bing.net/th?id=OIP.qozpQM59aX8SVgGRXAnGewHaE8&pid=Api&P=0&h=220', 'Volunteer Leadership'),
('course9', 'yes', 'Understand the process and importance of blood donation.', '3 hour', 5678, '109', 'https://tse1.mm.bing.net/th?id=OIP.Ab-QhD8DLQan0TkkhS6eNAHaE8&pid=Api&P=0&h=220', 'Blood Donation Awareness');

-- --------------------------------------------------------

--
-- Table structure for table `donationreports`
--

CREATE TABLE `donationreports` (
  `donationId` varchar(100) NOT NULL,
  `donationTime` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donationId` varchar(100) NOT NULL,
  `amount` varchar(20) DEFAULT NULL,
  `donationTime` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_ID` varchar(50) NOT NULL,
  `event_description` text DEFAULT NULL,
  `event_fees` varchar(20) DEFAULT NULL,
  `event_location` varchar(100) DEFAULT NULL,
  `event_title` varchar(255) DEFAULT NULL,
  `fees` int(11) DEFAULT NULL,
  `image_link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_ID`, `event_description`, `event_fees`, `event_location`, `event_title`, `fees`, `image_link`) VALUES
('event1', 'Join us for a life-saving blood donation event and help give the gift of life to those in need. Your donation can make a difference in someone\'s future!', '200', 'Nkubu', 'Blood Donation', 250, 'https://www.shutterstock.com/image-vector/blood-drop-plus-heart-shape-600nw-2238094877.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_key` varchar(100) NOT NULL,
  `feedbackId` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `receiverEmail` varchar(255) DEFAULT NULL,
  `senderEmail` varchar(255) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financereports`
--

CREATE TABLE `financereports` (
  `report_key` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `dateTime` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financerequests`
--

CREATE TABLE `financerequests` (
  `request_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `requestId` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groupmembers`
--

CREATE TABLE `groupmembers` (
  `id` int(11) NOT NULL,
  `groupId` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `groupId` varchar(20) NOT NULL,
  `groupName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`groupId`, `groupName`) VALUES
('BVCKTZI', 'Nairobi'),
('MBYJHRW', 'Group 1'),
('MW1O3KB', 'Meru'),
('XKLX0S9', 'test1'),
('YTELLN4', 'Mogotio');

-- --------------------------------------------------------

--
-- Table structure for table `itemrequests`
--

CREATE TABLE `itemrequests` (
  `request_key` varchar(50) NOT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `trainerEmail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organisationinventory`
--

CREATE TABLE `organisationinventory` (
  `itemName` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organisationinventory`
--

INSERT INTO `organisationinventory` (`itemName`, `category`, `count`) VALUES
('Defibrillator', 'Medical', 440),
('First Aid Kit', 'Medical', 115),
('Projectors', 'Training', 130),
('Safety Goggles', 'Protective Gear', 60);

-- --------------------------------------------------------

--
-- Table structure for table `paidrequests`
--

CREATE TABLE `paidrequests` (
  `payment_key` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `dateTime` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_key` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `dateTime` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `user_id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dob` varchar(20) DEFAULT NULL,
  `experiences` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `idNumber` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `returnedequipments`
--

CREATE TABLE `returnedequipments` (
  `equipment_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `borrow_date` bigint(20) DEFAULT NULL,
  `return_date` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliedgoods`
--

CREATE TABLE `suppliedgoods` (
  `request_key` varchar(50) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `requestId` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `timestamp` varchar(50) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplierinventory`
--

CREATE TABLE `supplierinventory` (
  `itemId` varchar(20) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `lastRestocked` varchar(20) DEFAULT NULL,
  `reorderLevel` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `unitPrice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplierinventory`
--

INSERT INTO `supplierinventory` (`itemId`, `category`, `itemName`, `lastRestocked`, `reorderLevel`, `status`, `stock`, `unitPrice`) VALUES
('001', 'Medical', 'First Aid Kit', '2024-10-01', 100, 'In Stock', 929, 1500),
('002', 'Medical', 'CPR Training Mankin', '2024-10-01', 10, 'In Stock', 98, 2333),
('003', 'Medical', 'Defibrillator', '2024-08-20', 10, 'In Stock', 860, 1500),
('004', 'Training', 'Projectors', '2024-09-29', 15, 'In Stock', 128, 15000),
('005', 'Protective Gear', 'Safety Goggles', '2024-10-05', 100, 'In Stock', 1893, 12500);

-- --------------------------------------------------------

--
-- Table structure for table `supplyrequest`
--

CREATE TABLE `supplyrequest` (
  `requestId` varchar(20) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `inventoryManager` varchar(255) DEFAULT NULL,
  `itemName` varchar(100) DEFAULT NULL,
  `requestCount` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `timestamp` varchar(50) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_key` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `endDate` varchar(20) DEFAULT NULL,
  `groupId` varchar(20) DEFAULT NULL,
  `startDate` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_key`, `description`, `endDate`, `groupId`, `startDate`, `status`) VALUES
('-OL1pZQXyQ7REFPn1QCw', 'gngh', '2025-03-28', 'MW1O3KB', '2025-03-11', 'In Progress'),
('-OL29cg_CX7FtPnOn6dl', 'dere', '2025-03-15', 'XKLX0S9', '2025-03-13', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `signupTime` bigint(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `role`, `signupTime`, `status`, `username`) VALUES
('abigaeljerotich@gmail_com', '123123', 'Youth', 1742866897446, 'approved', 'Abigail Jerotich'),
('brendan@gmail_com', '123123', 'Youth', 1738047382514, 'approved', 'Brendan Fraser'),
('charles@gmail_com', '123456789', 'Coordinator', 1729094723860, 'approved', 'Charles Kips'),
('chase@gmail_com', '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e', 'Supplier', 1741418427446, 'approved', 'Chase Suppliers'),
('coordinator@gmail_com', '12345678', 'Coordinator', 1729298149768, 'approved', 'Kipling Juma'),
('d43481202@gmail_com', '123123', 'Youth', 1741577549620, 'approved', 'gg'),
('david@gmail_com', '123456789', 'Service Manager', 1729442779574, 'approved', 'David Rudisha'),
('finance@gmail_com', '123123', 'Finance Manager', 1729840486372, 'approved', 'Abel Kimathi'),
('gakii@gmail_com', '123123', 'Volunteer', 1730851101454, 'approved', 'Elizabeth Gakii'),
('henry@gmail_com', '123123', 'Volunteer', 1730850980432, 'approved', 'Sir Henry Kabu'),
('inventory@gmail_com', '123123', 'Inventory Manager', 1729821433248, 'approved', 'Ken Lusaka'),
('jeptoo@gmail_com', '123123', 'Youth', 1742715651866, 'approved', 'Veronica Jeptoo'),
('job@gmail_com', '123123', 'Volunteer', 1730851044133, 'approved', 'Peterson Job'),
('johnkimani@gmail_com', '123123', 'Youth', 1742881792753, 'approved', 'John Kimani'),
('juma@gmail_com', '123123', 'Youth', 1728201155341, 'approved', 'Juma mike'),
('june@gmail_com', '123123', 'Volunteer', 1738219717827, 'approved', 'June Kubet'),
('kaje@gmail_com', '123123', 'Youth', 1740726830933, 'approved', 'David Kaje'),
('karen@gmail_com', '123123', 'Volunteer', 1730851170042, 'approved', 'Johnson Karen'),
('kencop@gmail_com', '123123', 'Supplier', 1729739820999, 'approved', 'KEN COP'),
('kibble@gmail_com', '123123', 'Youth', 1741768801742, 'approved', 'Brian Kibble'),
('kibe@gmail_com', '123123', 'Finance Manager', 1728201346146, 'approved', 'kibe'),
('kiptoomoses156@gmail_com', '123456', 'Youth', 1729647114086, 'approved', 'Moses Kipngetich Kiptoo'),
('koros@gmail_com', 'b3fd850fb0ae644ad23a20055c8767bece518e5089d059a3d38cc305126c1cd1', 'Service Manager', 1731307938623, 'approved', 'Roy Kigen Koros'),
('medicaldepot@gmail_com', '123123', 'Supplier', 1742866948508, 'approved', 'Medical Depot'),
('michael@gmail_com', 'Michael@123', 'Youth', 1728644656177, 'approved', 'Michael'),
('mohammed@gmail_com', '123123', 'Youth', 1730784168018, 'approved', 'Mohammed Ali'),
('mwaka@gmail_com', '123123', 'Youth', 1738824755367, 'approved', 'Mwaka Mojo'),
('mwangi@gmail_com', '123123', 'Youth', 1741597881749, 'approved', 'Emlyn Mwangi'),
('njoki@gmail_com', '123123', 'Trainer', 1741578225750, 'approved', 'Elizabeth Njoki'),
('peter@gmail_com', '123123', 'Youth', 1730948621660, 'approved', 'Peter Kiptoo'),
('pkemoi@gmail_com', 'Pk123#12', 'Youth', 1738047661474, 'approved', 'pkemoi'),
('rael@gmail_com', '123123', 'Volunteer', 1730851322037, 'approved', 'Rael Nobody'),
('ror@gmail_com', '123123', 'Youth', 1742807848883, 'approved', 'ror'),
('roykeane@gmail_com', '123123', 'Youth', 1742657063176, 'approved', 'Roy Keane'),
('ruto@gmail_com', '123456', 'Volunteer', 1740727904054, 'approved', 'Angella Ruto'),
('service2@gmail_com', '123123', 'Service Manager', 1728479263033, 'approved', 'Jeff Bezos'),
('service@gmail_com', '123123', 'Service Manager', 1728276521316, 'approved', 'Service Manager'),
('sufuri@gmail_com', '123123', 'Volunteer', 1738219631099, 'approved', 'Zero sufuri'),
('trainer3@gmail_com', '123123', 'Trainer', 1728464008168, 'approved', 'Andrew'),
('trainer@gmail_com', '123123', 'Trainer', 1728286831114, 'deactivated', 'Kiplagat'),
('vivian@gmail_com', '123123', 'Volunteer', 1730790619699, 'approved', 'Vivian Lewis'),
('volunteer@email_com', '123123', 'Volunteer', 1730348191571, 'approved', 'Roseburg Clementine'),
('volunteer@gmail_com', '123123', 'Volunteer', 1742922555118, 'approved', 'Volunteer'),
('wechuli@gmail_com', '9a900403ac313ba27a1bc81f0932652b8020dac92c234d98fa0b06bf0040ecfd', 'Service Manager', 1742261118657, 'approved', 'John Wechuli'),
('youth1@gmail_com', '123123', 'Youth', 1728199642857, 'approved', 'youth1'),
('zora@gmail_com', '123123', 'Volunteer', 1738219743234, 'approved', 'Zora Kubet');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `borrowedequipments`
--
ALTER TABLE `borrowedequipments`
  ADD PRIMARY KEY (`equipment_key`),
  ADD KEY `email` (`email`),
  ADD KEY `itemName` (`itemName`);

--
-- Indexes for table `contactusmessages`
--
ALTER TABLE `contactusmessages`
  ADD PRIMARY KEY (`message_key`),
  ADD KEY `userEmail` (`userEmail`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_key`);

--
-- Indexes for table `donationreports`
--
ALTER TABLE `donationreports`
  ADD PRIMARY KEY (`donationId`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donationId`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_ID`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_key`),
  ADD KEY `receiverEmail` (`receiverEmail`),
  ADD KEY `senderEmail` (`senderEmail`);

--
-- Indexes for table `financereports`
--
ALTER TABLE `financereports`
  ADD PRIMARY KEY (`report_key`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`);

--
-- Indexes for table `financerequests`
--
ALTER TABLE `financerequests`
  ADD PRIMARY KEY (`request_key`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`);

--
-- Indexes for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groupId` (`groupId`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`groupId`);

--
-- Indexes for table `itemrequests`
--
ALTER TABLE `itemrequests`
  ADD PRIMARY KEY (`request_key`),
  ADD KEY `trainerEmail` (`trainerEmail`),
  ADD KEY `itemName` (`itemName`);

--
-- Indexes for table `organisationinventory`
--
ALTER TABLE `organisationinventory`
  ADD PRIMARY KEY (`itemName`);

--
-- Indexes for table `paidrequests`
--
ALTER TABLE `paidrequests`
  ADD PRIMARY KEY (`payment_key`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_key`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `returnedequipments`
--
ALTER TABLE `returnedequipments`
  ADD PRIMARY KEY (`equipment_key`),
  ADD KEY `email` (`email`),
  ADD KEY `itemName` (`itemName`);

--
-- Indexes for table `suppliedgoods`
--
ALTER TABLE `suppliedgoods`
  ADD PRIMARY KEY (`request_key`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`),
  ADD KEY `requestId` (`requestId`);

--
-- Indexes for table `supplierinventory`
--
ALTER TABLE `supplierinventory`
  ADD PRIMARY KEY (`itemId`);

--
-- Indexes for table `supplyrequest`
--
ALTER TABLE `supplyrequest`
  ADD PRIMARY KEY (`requestId`),
  ADD KEY `inventoryManager` (`inventoryManager`),
  ADD KEY `supplier` (`supplier`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_key`),
  ADD KEY `groupId` (`groupId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groupmembers`
--
ALTER TABLE `groupmembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrowedequipments`
--
ALTER TABLE `borrowedequipments`
  ADD CONSTRAINT `borrowedequipments_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `borrowedequipments_ibfk_2` FOREIGN KEY (`itemName`) REFERENCES `organisationinventory` (`itemName`);

--
-- Constraints for table `contactusmessages`
--
ALTER TABLE `contactusmessages`
  ADD CONSTRAINT `contactusmessages_ibfk_1` FOREIGN KEY (`userEmail`) REFERENCES `users` (`email`);

--
-- Constraints for table `donationreports`
--
ALTER TABLE `donationreports`
  ADD CONSTRAINT `donationreports_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `donationreports_ibfk_2` FOREIGN KEY (`donationId`) REFERENCES `donations` (`donationId`);

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`receiverEmail`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`senderEmail`) REFERENCES `users` (`email`);

--
-- Constraints for table `financereports`
--
ALTER TABLE `financereports`
  ADD CONSTRAINT `financereports_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `financereports_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`);

--
-- Constraints for table `financerequests`
--
ALTER TABLE `financerequests`
  ADD CONSTRAINT `financerequests_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `financerequests_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`);

--
-- Constraints for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD CONSTRAINT `groupmembers_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`),
  ADD CONSTRAINT `groupmembers_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `itemrequests`
--
ALTER TABLE `itemrequests`
  ADD CONSTRAINT `itemrequests_ibfk_1` FOREIGN KEY (`trainerEmail`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `itemrequests_ibfk_2` FOREIGN KEY (`itemName`) REFERENCES `organisationinventory` (`itemName`);

--
-- Constraints for table `paidrequests`
--
ALTER TABLE `paidrequests`
  ADD CONSTRAINT `paidrequests_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `paidrequests_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`);

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `returnedequipments`
--
ALTER TABLE `returnedequipments`
  ADD CONSTRAINT `returnedequipments_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `returnedequipments_ibfk_2` FOREIGN KEY (`itemName`) REFERENCES `organisationinventory` (`itemName`);

--
-- Constraints for table `suppliedgoods`
--
ALTER TABLE `suppliedgoods`
  ADD CONSTRAINT `suppliedgoods_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `suppliedgoods_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `suppliedgoods_ibfk_3` FOREIGN KEY (`requestId`) REFERENCES `supplyrequest` (`requestId`);

--
-- Constraints for table `supplyrequest`
--
ALTER TABLE `supplyrequest`
  ADD CONSTRAINT `supplyrequest_ibfk_1` FOREIGN KEY (`inventoryManager`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `supplyrequest_ibfk_2` FOREIGN KEY (`supplier`) REFERENCES `users` (`email`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`groupId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
