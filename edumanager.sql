-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 03:50 PM
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
-- Database: `edumanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `cotdiem`
--

CREATE TABLE `cotdiem` (
  `id` int(11) NOT NULL,
  `decuong_id` int(11) NOT NULL,
  `ten_cot_diem` varchar(100) NOT NULL,
  `ty_le_phan_tram` decimal(5,2) NOT NULL,
  `hinh_thuc` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cotdiem`
--

INSERT INTO `cotdiem` (`id`, `decuong_id`, `ten_cot_diem`, `ty_le_phan_tram`, `hinh_thuc`) VALUES
(20, 1, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(21, 1, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(22, 1, 'Điểm thảo luận', 10.00, 'Thảo luận nhóm'),
(23, 1, 'Điểm kiểm tra', 20.00, 'Trắc nghiệm'),
(24, 1, 'Điểm thi cuối kỳ', 50.00, 'Tự luận'),
(25, 2, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(26, 2, 'Điểm bài tập', 20.00, 'Bài tập về nhà'),
(27, 2, 'Điểm kiểm tra', 20.00, 'Trắc nghiệm + Tự luận'),
(28, 2, 'Điểm thi cuối kỳ', 50.00, 'Tự luận'),
(29, 3, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(30, 3, 'Điểm bài tập', 15.00, 'Bài tập về nhà'),
(31, 3, 'Điểm kiểm tra', 15.00, 'Trắc nghiệm'),
(32, 3, 'Điểm đồ án', 20.00, 'Đồ án nhóm'),
(33, 3, 'Điểm thi thực hành', 40.00, 'Thực hành cá nhân'),
(34, 4, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(35, 4, 'Điểm thảo luận', 10.00, 'Thảo luận nhóm'),
(36, 4, 'Điểm kiểm tra', 20.00, 'Trắc nghiệm'),
(37, 4, 'Điểm đồ án', 30.00, 'Đồ án nhóm'),
(38, 4, 'Điểm thi cuối kỳ', 30.00, 'Tự luận'),
(44, 5, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(45, 5, 'Điểm chuyên cần', 10.00, 'Điểm danh'),
(46, 5, 'Điểm thảo luận', 10.00, 'Thảo luận nhóm'),
(47, 5, 'Điểm đồ án', 20.00, 'Đồ án nhóm'),
(48, 5, 'Điểm thi cuối kỳ', 50.00, 'Tự luận');

-- --------------------------------------------------------

--
-- Table structure for table `decuongchitiet`
--

CREATE TABLE `decuongchitiet` (
  `id` int(11) NOT NULL,
  `hoc_phan_id` int(11) NOT NULL,
  `muc_tieu` text DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `phuong_phap_giang_day` text DEFAULT NULL,
  `phuong_phap_danh_gia` text DEFAULT NULL,
  `tai_lieu_tham_khao` text DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `decuongchitiet`
--

INSERT INTO `decuongchitiet` (`id`, `hoc_phan_id`, `muc_tieu`, `noi_dung`, `phuong_phap_giang_day`, `phuong_phap_danh_gia`, `tai_lieu_tham_khao`, `trang_thai`) VALUES
(1, 1, 'Trang bị kiến thức cơ bản về triết học Mác-Lênin', 'Chương 1: Khái luận về Triết học và vai trò của Triết học\nChương 2: Chủ nghĩa duy vật biện chứng\nChương 3: Chủ nghĩa duy vật lịch sử', 'Thuyết giảng, thảo luận nhóm', '1,9,15,3,4', 'Giáo trình Triết học Mác-Lênin, NXB Chính trị Quốc gia, 2021', 1),
(2, 9, 'Trang bị kiến thức cơ bản về lập trình và kỹ năng giải quyết vấn đề', 'Chương 1: Giới thiệu về lập trình\nChương 2: Biến và kiểu dữ liệu\nChương 3: Cấu trúc điều khiển\nChương 4: Hàm và module\nChương 5: Mảng và chuỗi', NULL, '5,6,7,24', NULL, 1),
(3, 10, 'Trang bị kiến thức về lập trình hướng đối tượng và các nguyên tắc thiết kế', 'Chương 1: Tổng quan về lập trình hướng đối tượng\nChương 2: Lớp và đối tượng\nChương 3: Tính kế thừa\nChương 4: Tính đa hình\nChương 5: Mẫu thiết kế', 'Thuyết giảng, thực hành trên máy tính, bài tập lớn, đồ án môn học', '9,10,11,12,13', 'Object-Oriented Programming in Java, Barnes D.J., Kölling M., Pearson, 2020', 1),
(4, 15, 'Trang bị kiến thức về quy trình phát triển phần mềm và kỹ năng làm việc nhóm', 'Chương 1: Giới thiệu về Công nghệ phần mềm\nChương 2: Quy trình phát triển phần mềm\nChương 3: Phân tích yêu cầu\nChương 4: Thiết kế phần mềm\nChương 5: Kiểm thử phần mềm\nChương 6: Bảo trì và tiến hóa phần mềm', 'Thuyết giảng, thảo luận nhóm, đồ án', '14,15,16,17,18', 'Software Engineering, Ian Sommerville, Pearson, 2021', 1),
(5, 25, 'Trang bị kiến thức và kỹ năng thực hiện đề tài tốt nghiệp', 'Sinh viên thực hiện một đề tài nghiên cứu hoặc phát triển sản phẩm dưới sự hướng dẫn của giảng viên', 'Hướng dẫn cá nhân, seminar, báo cáo tiến độ', '39,40,41,42,43', 'Tùy theo đề tài cụ thể', 1),
(6, 27, 'hẹ hẹ hẹ', 'aaaaaa', 'hẹ hẹ hẹ', 'hẹ hẹ hẹ', 'hẹ hẹ hẹ', 0),
(7, 33, 'a', 'a', 's', 's', 's', 0),
(8, 30, 'asdsad', 'asd', '1', '1,4,6,9,10', 's2', 1),
(9, 28, 'a', 's', 'a', '1,2,6,4', 's', 1);

-- --------------------------------------------------------

--
-- Table structure for table `giangvien`
--

CREATE TABLE `giangvien` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ma_gv` varchar(50) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `bo_mon` varchar(100) DEFAULT NULL,
  `khoa` varchar(100) DEFAULT NULL,
  `trinh_do` varchar(50) DEFAULT NULL,
  `chuyen_mon` varchar(100) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL,
  `chuc_vu` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ma_giang_vien` varchar(20) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giangvien`
--

INSERT INTO `giangvien` (`id`, `user_id`, `ma_gv`, `ho_ten`, `bo_mon`, `khoa`, `trinh_do`, `chuyen_mon`, `trang_thai`, `chuc_vu`, `email`, `ma_giang_vien`, `so_dien_thoai`) VALUES
(1, 3, 'GV001', 'Trần Thị Phương', 'Công nghệ phần mềm', 'Công nghệ thông tin', 'Tiến sĩ', 'Công nghệ phần mềm, Kiểm thử phần mềm', 1, NULL, NULL, NULL, NULL),
(2, 4, 'GV002', 'Lê Thanh Hùng', 'Khoa học máy tính', 'Công nghệ thông tin', 'Tiến sĩ', 'Trí tuệ nhân tạo, Machine Learning', 1, NULL, NULL, NULL, NULL),
(3, 5, 'GV003', 'Phạm Tuấn Minh', 'Hệ thống thông tin', 'Công nghệ thông tin', 'Thạc sĩ', 'Cơ sở dữ liệu, Data Mining', 1, NULL, NULL, NULL, NULL),
(4, 6, 'GV004', 'Nguyễn Thị Lan', 'Mạng máy tính', 'Công nghệ thông tin', 'Tiến sĩ', 'An toàn mạng, Điện toán đám mây', 1, NULL, NULL, NULL, NULL),
(5, 7, 'GV005', 'Trần Văn Bình', 'Công nghệ phần mềm', 'Công nghệ thông tin', 'Thạc sĩ', 'Phát triển Web, Mobile Computing', 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hocphan`
--

CREATE TABLE `hocphan` (
  `id` int(11) NOT NULL,
  `ma_hp` varchar(50) NOT NULL,
  `ten_hp` varchar(255) NOT NULL,
  `so_tin_chi` int(11) NOT NULL,
  `so_tiet_ly_thuyet` int(11) DEFAULT NULL,
  `so_tiet_thuc_hanh` int(11) DEFAULT NULL,
  `nhom_id` int(11) DEFAULT NULL,
  `loai_hp` varchar(50) DEFAULT NULL,
  `hoc_phan_tien_quyet` varchar(255) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hocphan`
--

INSERT INTO `hocphan` (`id`, `ma_hp`, `ten_hp`, `so_tin_chi`, `so_tiet_ly_thuyet`, `so_tiet_thuc_hanh`, `nhom_id`, `loai_hp`, `hoc_phan_tien_quyet`, `trang_thai`) VALUES
(1, 'CB001', 'Triết học Mác - Lênin', 3, 45, 0, 1, 'Bắt buộc', NULL, 0),
(2, 'CB002', 'Kinh tế chính trị Mác - Lênin test cập nhật', 2, 30, 0, 1, 'Bắt buộc', 'CB001', 1),
(3, 'CB003', 'Tư tưởng Hồ Chí Minh', 2, 30, 0, 1, 'Bắt buộc', 'CB001', 0),
(4, 'CB004', 'Tiếng Anh 1', 4, 45, 30, 1, 'Bắt buộc', NULL, 0),
(5, 'CB005', 'Tiếng Anh 2', 4, 45, 30, 1, 'Bắt buộc', 'CB004', 0),
(6, 'CB006', 'Giải tích 1', 3, 45, 0, 1, 'Bắt buộc', NULL, 0),
(7, 'CB007', 'Đại số tuyến tính', 3, 45, 0, 1, 'Bắt buộc', NULL, 0),
(8, 'CB008', 'Xác suất thống kê', 3, 45, 0, 1, 'Bắt buộc', 'CB006', 0),
(9, 'IT001', 'Nhập môn lập trình', 4, 30, 60, 2, 'Bắt buộc', NULL, 0),
(10, 'IT002', 'Lập trình hướng đối tượng', 4, 30, 60, 2, 'Bắt buộc', 'IT001', 0),
(11, 'IT003', 'Cấu trúc dữ liệu và giải thuật', 4, 30, 60, 2, 'Bắt buộc', 'IT001', 0),
(12, 'IT004', 'Cơ sở dữ liệu', 4, 45, 30, 2, 'Bắt buộc', NULL, 0),
(13, 'IT005', 'Mạng máy tính', 4, 45, 30, 2, 'Bắt buộc', NULL, 0),
(14, 'IT006', 'Hệ điều hành', 4, 45, 30, 2, 'Bắt buộc', NULL, 0),
(15, 'CN001', 'Công nghệ phần mềm', 4, 45, 30, 3, 'Bắt buộc', 'IT002', 0),
(16, 'CN002', 'Trí tuệ nhân tạo', 4, 45, 30, 3, 'Bắt buộc', 'IT003', 0),
(17, 'CN003', 'Phát triển ứng dụng web', 4, 30, 60, 3, 'Bắt buộc', 'IT002', 0),
(18, 'CN004', 'Phát triển ứng dụng di động', 4, 30, 60, 3, 'Bắt buộc', 'IT002', 0),
(19, 'CN005', 'An toàn và bảo mật thông tin', 4, 45, 30, 3, 'Bắt buộc', 'IT005', 0),
(20, 'CN006', 'Điện toán đám mây', 3, 30, 30, 3, 'Tự chọn', 'IT005', 0),
(21, 'CN007', 'Phân tích dữ liệu lớn', 3, 30, 30, 3, 'Tự chọn', 'IT004', 0),
(22, 'CN008', 'Blockchain và ứng dụng', 3, 30, 30, 3, 'Tự chọn', NULL, 0),
(23, 'CN009', 'Thị giác máy tính', 3, 30, 30, 3, 'Tự chọn', 'CN002', 0),
(24, 'CN010', 'Xử lý ngôn ngữ tự nhiên', 3, 30, 30, 3, 'Tự chọn', 'CN002', 0),
(25, 'TN001', 'Thực tập tốt nghiệp', 5, 0, 150, 4, 'Bắt buộc', NULL, 0),
(26, 'TN002', 'Khóa luận tốt nghiệp', 10, 0, 300, 4, 'Bắt buộc', NULL, 0),
(27, 'TOIDAY', 'TOI TEST 1234', 4, 30, 30, 2, 'Bắt buộc', 'CB001', 0),
(28, 'TOIDAY2', 'TOI TEST 1234', 4, 30, 30, 2, 'Bắt buộc', 'TOIDAY1', 0),
(30, 'TOIDAY3', 'TOI TEST 123456', 2, 0, 30, 2, 'Bắt buộc', 'TOIDAY2', 0),
(31, 'teetetet', 'test hoc phần', 4, 30, 15, 1, 'Bắt buộc', NULL, 0),
(32, 'aaaaaaa', '1asdasd', 2, 2, 2, 6, 'Bắt buộc', NULL, 0),
(33, 'hihi', 'he hẹ he', 8, 30, 10, 6, 'Bắt buộc', NULL, 0),
(34, 'hheheheheh', 'asdasd', 10, 2, 60, 6, 'Bắt buộc', NULL, 0),
(35, 'aaaaaaaa', 'bbbbbbbbbbbb', 10, 2, 60, 6, 'Bắt buộc', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `kehoachdayhoc`
--

CREATE TABLE `kehoachdayhoc` (
  `id` int(11) NOT NULL,
  `ctdt_id` int(11) NOT NULL,
  `hoc_phan_id` int(11) NOT NULL,
  `hoc_ky` int(11) NOT NULL,
  `nam_hoc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kehoachdayhoc`
--

INSERT INTO `kehoachdayhoc` (`id`, `ctdt_id`, `hoc_phan_id`, `hoc_ky`, `nam_hoc`) VALUES
(1, 1, 1, 1, 2023),
(2, 1, 4, 1, 2023),
(3, 1, 6, 1, 2023),
(4, 1, 7, 1, 2023),
(5, 1, 5, 2, 2023),
(6, 1, 2, 2, 2023),
(7, 1, 8, 2, 2023),
(8, 1, 9, 2, 2023),
(9, 1, 3, 3, 2024),
(10, 1, 10, 3, 2024),
(11, 1, 11, 3, 2024),
(12, 1, 12, 3, 2024),
(13, 1, 13, 4, 2024),
(14, 1, 14, 4, 2024),
(15, 1, 15, 5, 2025),
(16, 1, 16, 5, 2025),
(17, 1, 17, 5, 2025),
(18, 1, 18, 6, 2025),
(19, 1, 19, 6, 2025),
(20, 1, 20, 6, 2025),
(21, 1, 21, 6, 2025),
(22, 1, 25, 8, 2026),
(23, 1, 26, 8, 2026),
(24, 2, 1, 1, 2025),
(25, 2, 2, 1, 2025),
(26, 2, 3, 1, 2025);

-- --------------------------------------------------------

--
-- Table structure for table `kehoachmonhom`
--

CREATE TABLE `kehoachmonhom` (
  `id` int(11) NOT NULL,
  `ma_nhom` varchar(20) NOT NULL,
  `hoc_phan_id` int(11) NOT NULL,
  `nam_hoc` varchar(20) NOT NULL,
  `hoc_ky` int(11) NOT NULL,
  `so_luong_sv` int(11) DEFAULT NULL,
  `thoi_gian_bat_dau` date DEFAULT NULL,
  `thoi_gian_ket_thuc` date DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kehoachmonhom`
--

INSERT INTO `kehoachmonhom` (`id`, `ma_nhom`, `hoc_phan_id`, `nam_hoc`, `hoc_ky`, `so_luong_sv`, `thoi_gian_bat_dau`, `thoi_gian_ket_thuc`, `trang_thai`) VALUES
(1, 'CB001.01', 1, '2023-2024', 1, 60, '2023-08-15', '2023-12-31', 2),
(2, 'CB001.02', 1, '2023-2024', 1, 60, '2023-08-15', '2023-12-31', 2),
(3, 'CB004.01', 4, '2023-2024', 1, 40, '2023-08-15', '2023-12-31', 2),
(4, 'CB004.02', 4, '2023-2024', 1, 40, '2023-08-15', '2023-12-31', 2),
(5, 'CB004.03', 4, '2023-2024', 1, 40, '2023-08-15', '2023-12-31', 2),
(6, 'IT001.01', 9, '2023-2024', 2, 35, '2024-01-15', '2024-05-31', 2),
(7, 'IT001.02', 9, '2023-2024', 2, 35, '2024-01-15', '2024-05-31', 2),
(8, 'IT002.01', 10, '2024-2025', 1, 35, '2024-08-15', '2024-12-31', 1),
(9, 'IT002.02', 10, '2024-2025', 1, 35, '2024-08-15', '2024-12-31', 1),
(10, 'CN001.01', 15, '2025-2026', 1, 30, '2025-08-15', '2025-12-31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `khungchuongtrinh`
--

CREATE TABLE `khungchuongtrinh` (
  `id` int(11) NOT NULL,
  `ctdt_id` int(11) NOT NULL,
  `ma_nhom` varchar(50) NOT NULL,
  `ten_nhom` varchar(255) NOT NULL,
  `so_tin_chi_toi_thieu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khungchuongtrinh`
--

INSERT INTO `khungchuongtrinh` (`id`, `ctdt_id`, `ma_nhom`, `ten_nhom`, `so_tin_chi_toi_thieu`) VALUES
(1, 1, 'GDDC', 'Khối kiến thức giáo dục đại cương', 45),
(2, 1, 'CSN', 'Khối kiến thức cơ sở ngành', 30),
(3, 1, 'CN', 'Khối kiến thức chuyên ngành', 55),
(4, 1, 'TN', 'Khối kiến thức tốt nghiệp', 15),
(5, 2, 'GDDC', 'Khối kiến thức giáo dục đại cương', 45),
(6, 2, 'CSN', 'Khối kiến thức cơ sở ngành', 34),
(7, 2, 'CN', 'Khối kiến thức chuyên ngành', 50),
(8, 2, 'TN', 'Khối kiến thức tốt nghiệp', 16),
(9, 3, 'GDDC', 'Khối kiến thức giáo dục đại cương', 45),
(10, 3, 'CSN', 'Khối kiến thức cơ sở ngành', 32),
(11, 3, 'CN', 'Khối kiến thức chuyên ngành', 52),
(12, 3, 'TN', 'Khối kiến thức tốt nghiệp', 16);

-- --------------------------------------------------------

--
-- Table structure for table `khungchuongtrinh_nhomkienthuc`
--

CREATE TABLE `khungchuongtrinh_nhomkienthuc` (
  `id` int(11) NOT NULL,
  `id_khungchuongtrinh` int(11) NOT NULL,
  `id_manhom` int(11) NOT NULL,
  `sotinchibatbuoc` int(11) DEFAULT NULL,
  `sotinchituchon` int(11) DEFAULT NULL,
  `khung_chuong_trinh_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khungchuongtrinh_nhomkienthuc`
--

INSERT INTO `khungchuongtrinh_nhomkienthuc` (`id`, `id_khungchuongtrinh`, `id_manhom`, `sotinchibatbuoc`, `sotinchituchon`, `khung_chuong_trinh_id`) VALUES
(1, 1, 1, 40, 5, NULL),
(2, 1, 3, 25, 5, NULL),
(3, 1, 4, 45, 10, NULL),
(4, 1, 6, 10, 5, NULL),
(5, 2, 1, 40, 5, NULL),
(6, 2, 3, 30, 4, NULL),
(7, 2, 4, 40, 10, NULL),
(8, 2, 6, 10, 6, NULL),
(9, 3, 1, 40, 5, NULL),
(10, 3, 3, 27, 5, NULL),
(11, 3, 4, 42, 10, NULL),
(12, 3, 6, 10, 6, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nhomkienthuc`
--

CREATE TABLE `nhomkienthuc` (
  `id` int(11) NOT NULL,
  `manhom` varchar(50) NOT NULL,
  `ten_nhom` varchar(255) NOT NULL,
  `trangthai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nhomkienthuc`
--

INSERT INTO `nhomkienthuc` (`id`, `manhom`, `ten_nhom`, `trangthai`) VALUES
(1, 'GDDC', 'Giáo dục đại cương', 1),
(2, 'CSNN', 'Cơ sở nhóm ngành', 1),
(3, 'CSN', 'Cơ sở ngành', 1),
(4, 'CN', 'Chuyên ngành', 1),
(5, 'TC', 'Tự chọn', 0),
(6, 'TN', 'Tốt nghiệp', 1),
(7, 'Test', 'tên nhóm test', NULL),
(8, 'CN', 'chuyên ngành test', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `outline_detail`
--

CREATE TABLE `outline_detail` (
  `id` int(11) NOT NULL,
  `phuong_phap_danh_gia` varchar(255) DEFAULT NULL,
  `phuong_phap_giang_day` varchar(255) DEFAULT NULL,
  `muc_tieu` varchar(50) NOT NULL,
  `thoi_gian` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phanconggiangday`
--

CREATE TABLE `phanconggiangday` (
  `id` int(11) NOT NULL,
  `nhom_id` int(11) NOT NULL,
  `giang_vien_id` int(11) NOT NULL,
  `vai_tro` varchar(50) DEFAULT NULL,
  `so_tiet` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phanconggiangday`
--

INSERT INTO `phanconggiangday` (`id`, `nhom_id`, `giang_vien_id`, `vai_tro`, `so_tiet`) VALUES
(1, 1, 1, 'Phụ trách', 45),
(2, 2, 2, 'Phụ trách', 45),
(3, 3, 4, 'Phụ trách', 75),
(4, 4, 4, 'Phụ trách', 75),
(6, 6, 3, 'Phụ trách', 90),
(7, 7, 3, 'Phụ trách', 90),
(8, 8, 5, 'Phụ trách', 90),
(9, 9, 5, 'Phụ trách', 90),
(10, 10, 1, 'Phụ trách', 75),
(11, 6, 1, 'Trợ giảng', 30),
(12, 7, 1, 'Trợ giảng', 30);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(3, 'admin'),
(1, 'giangvien'),
(4, 'nguoidung'),
(2, 'truongkhoa');

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `hinh_thuc` varchar(100) DEFAULT NULL,
  `ten_cot_diem` varchar(100) NOT NULL,
  `ty_le_phan_tram` float NOT NULL,
  `decuong_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thongtinchung`
--

CREATE TABLE `thongtinchung` (
  `id` int(11) NOT NULL,
  `ma_ctdt` varchar(50) NOT NULL,
  `ten_ctdt` varchar(255) NOT NULL,
  `nganh` varchar(100) DEFAULT NULL,
  `ma_nganh` varchar(50) DEFAULT NULL,
  `khoa_quan_ly` varchar(100) DEFAULT NULL,
  `he_dao_tao` varchar(50) DEFAULT NULL,
  `trinh_do` varchar(50) DEFAULT NULL,
  `tong_tin_chi` int(11) DEFAULT NULL,
  `thoi_gian_dao_tao` varchar(50) DEFAULT NULL,
  `nam_ban_hanh` int(11) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thongtinchung`
--

INSERT INTO `thongtinchung` (`id`, `ma_ctdt`, `ten_ctdt`, `nganh`, `ma_nganh`, `khoa_quan_ly`, `he_dao_tao`, `trinh_do`, `tong_tin_chi`, `thoi_gian_dao_tao`, `nam_ban_hanh`, `trang_thai`) VALUES
(1, 'CNTT2020', 'Chương trình đào tạo ngành Công nghệ thông tin', 'Công nghệ thông tin', '7480201', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 145, '4 năm', 2020, 1),
(2, 'KTPM2020', 'Chương trình đào tạo ngành Kỹ thuật phần mềm', 'Kỹ thuật phần mềm', '7480103', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 145, '4.5 năm', 202, 1),
(3, 'HTTT2021', 'Chương trình đào tạo ngành Hệ thống thông tin', 'Hệ thống thông tin', '7480104', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 145, '4 năm', 2021, 1),
(4, 'KHMT2021', 'Chương trình đào tạo ngành Khoa học máy tính', 'Khoa học máy tính', '7480101', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 145, '4 năm', 2021, 1),
(5, 'DTVT2022', 'Chương trình đào tạo ngành Điện tử viễn thông', 'Điện tử viễn thông', '7520207', 'Khoa Điện tử - Viễn thông', 'Chính quy', 'Đại học', 150, '4 năm', 2022, 0),
(6, 'KTPM2025', 'Kỹ thuật phần mềm', 'Công nghệ thông tin', '7480201', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 180, '4.5 năm', 2024, 1),
(7, 'CNPM2025', 'Công nghệ phần mềm', 'Công nghệ thông tin', '7480201', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 180, '4.5 năm', 2024, 0),
(8, 'CNPM2024', 'Công nghệ phần mềm', 'Công nghệ thông tin', '7480201', 'Khoa Công nghệ thông tin', 'Chính quy', 'Đại học', 180, '4.5 năm', 2024, 1),
(9, 'tetetet', 'trtetetetetetet', 'hẹ hẹ', '123aas', 'assad', 'Vừa làm vừa học', 'Cao đẳng', 23, '3', 2002, 1);

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_chung`
--

CREATE TABLE `thong_tin_chung` (
  `id` int(11) NOT NULL,
  `he_dao_tao` varchar(50) DEFAULT NULL,
  `khoa_quan_ly` varchar(100) DEFAULT NULL,
  `ma_ctdt` varchar(50) NOT NULL,
  `ma_nganh` varchar(50) NOT NULL,
  `nam_ban_hanh` int(11) DEFAULT NULL,
  `nganh` varchar(100) NOT NULL,
  `ten_ctdt` varchar(255) NOT NULL,
  `thoi_gian_dao_tao` varchar(50) DEFAULT NULL,
  `tong_tin_chi` int(11) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL,
  `trinh_do` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `vai_tro` int(50) DEFAULT NULL,
  `nam_sinh` int(11) DEFAULT NULL,
  `trang_thai` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `ho_ten`, `email`, `so_dien_thoai`, `vai_tro`, `nam_sinh`, `trang_thai`) VALUES
(1, 'admin', '$2y$10$FKlZJ6Ky0GPM/tAEFO.DwehOQHblUCfEbOM35ZED3kN32yVxUcmOe', 'Quản trị viên', 'admin@truong.edu.vn', '0901234567', 3, 1985, b'1'),
(2, 'truongkhoa', '$2y$10$IiU5NAzEpBnZ1K7V3YlbVew5a3RKV1hEfYCJqXcLYU4DQB3TLW3hW', 'Nguyễn Văn Trưởng', 'truongkhoa@truong.edu.vn', '0912345678', 2, 1975, b'1'),
(3, 'phuong', '$2y$10$0gLaiD6mxrx.yBBgF5yKZOAfl/IK6D1Kj0.oRiJK7n0ZwGpysVZxi', 'Trần Thị Phương', 'phuong@truong.edu.vn', '0923456789', 1, 1980, b'1'),
(4, 'hung', '$2y$10$YeG6nF2FtV4y09KF96yTveyrNhU0Mb6aSvDsycHMZCHoG4s45HUFq', 'Lê Thanh Hùng', 'hung@truong.edu.vn', '0934567890', 1, 1982, b'1'),
(5, 'minh', '$2y$10$1E/R23EwIfWf8QQyF3lqkeNYHj.YlbVJbCVP5N523XsIxkzZBBmHC', 'Phạm Tuấn Minh', 'minh@truong.edu.vn', '0945678901', 1, 1985, b'1'),
(6, 'lan', '$2y$10$9UAfLvv/OO5K19RlVGJO0e2Rl43W1JSQio4BXdGJZyDfvYKbnlPom', 'Nguyễn Thị Lan', 'lan@truong.edu.vn', '0956789012', 1, 1987, b'1'),
(7, 'binh', '$2y$10$w6BFRxeRefP9zZrmdQA3qedAI0FN9XgpRcvJLSOLmV0kHXUbDEROa', 'Trần Văn Bình', 'binh@truong.edu.vn', '0967890123', 1, 1979, b'1'),
(8, 'linh', '$2y$10$uM/mfghPzDzT0ZoJ5DJVQuhl3rjXwQeE04zzar9Kru9mKdgIEQ8kW', 'Võ Thị Linh', 'linh@truong.edu.vn', '0978901234', 1, 1990, b'1'),
(9, 'user123121242', '$2a$10$uoxVcg5Hn1EyY1IwDEc/su3ppHp5oAB7h6oCGNxY.YQE.HS9lPCny', 'Nguyễn Văn ACXC', 'user123@example.com', '0123456789', 4, 2004, b'0'),
(10, 'toiday', '$2a$10$yBj7gvK8otROZlkd/esNMubkEKyV.NZCX6GIpOIg9EaNgZPKAjrQe', 'tester', 'test@gmail.com', '012345678', 4, 2004, b'1'),
(11, 'aaa', '$2a$10$HaNhrR268lD8AL8ZKUa9q.SD4hYeaaVWRzja98gQdkosCQFjmOoae', 'asd', 'tes@gmail.com', '01234556789', 4, 2004, b'1'),
(12, 'aba', '$2a$10$uzg6EXaLV67efANZ2LGzCOBf7LOteyHWChAWW0q0cG4NVKOBSjuC.', 'asd', 'tes2@gmail.com', '01234556789', 4, 2004, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(9, 1),
(11, 1),
(12, 4),
(2, 2),
(3, 1),
(1, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cotdiem`
--
ALTER TABLE `cotdiem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `decuong_id` (`decuong_id`);

--
-- Indexes for table `decuongchitiet`
--
ALTER TABLE `decuongchitiet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hoc_phan_id` (`hoc_phan_id`);

--
-- Indexes for table `giangvien`
--
ALTER TABLE `giangvien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_gv` (`ma_gv`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hocphan`
--
ALTER TABLE `hocphan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_hp` (`ma_hp`),
  ADD KEY `nhom_id` (`nhom_id`);

--
-- Indexes for table `kehoachdayhoc`
--
ALTER TABLE `kehoachdayhoc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ctdt_id` (`ctdt_id`),
  ADD KEY `hoc_phan_id` (`hoc_phan_id`);

--
-- Indexes for table `kehoachmonhom`
--
ALTER TABLE `kehoachmonhom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hoc_phan_id` (`hoc_phan_id`);

--
-- Indexes for table `khungchuongtrinh`
--
ALTER TABLE `khungchuongtrinh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ctdt_id` (`ctdt_id`);

--
-- Indexes for table `khungchuongtrinh_nhomkienthuc`
--
ALTER TABLE `khungchuongtrinh_nhomkienthuc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_khungchuongtrinh` (`id_khungchuongtrinh`),
  ADD KEY `id_manhom` (`id_manhom`),
  ADD KEY `FK9kwc3vve8qsyvxxynm26tphiu` (`khung_chuong_trinh_id`);

--
-- Indexes for table `nhomkienthuc`
--
ALTER TABLE `nhomkienthuc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outline_detail`
--
ALTER TABLE `outline_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phanconggiangday`
--
ALTER TABLE `phanconggiangday`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nhom_id` (`nhom_id`),
  ADD KEY `giang_vien_id` (`giang_vien_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8sewwnpamngi6b1dwaa88askk` (`name`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKs6xva6csnux440glxtciecwhe` (`decuong_id`);

--
-- Indexes for table `thongtinchung`
--
ALTER TABLE `thongtinchung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_ctdt` (`ma_ctdt`);

--
-- Indexes for table `thong_tin_chung`
--
ALTER TABLE `thong_tin_chung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD KEY `FKrhfovtciq1l558cw6udg0h0d3` (`role_id`),
  ADD KEY `FK55itppkw3i07do3h7qoclqd4k` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cotdiem`
--
ALTER TABLE `cotdiem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `decuongchitiet`
--
ALTER TABLE `decuongchitiet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `giangvien`
--
ALTER TABLE `giangvien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `hocphan`
--
ALTER TABLE `hocphan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `kehoachdayhoc`
--
ALTER TABLE `kehoachdayhoc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `kehoachmonhom`
--
ALTER TABLE `kehoachmonhom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `khungchuongtrinh`
--
ALTER TABLE `khungchuongtrinh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `khungchuongtrinh_nhomkienthuc`
--
ALTER TABLE `khungchuongtrinh_nhomkienthuc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `nhomkienthuc`
--
ALTER TABLE `nhomkienthuc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `outline_detail`
--
ALTER TABLE `outline_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phanconggiangday`
--
ALTER TABLE `phanconggiangday`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thongtinchung`
--
ALTER TABLE `thongtinchung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `thong_tin_chung`
--
ALTER TABLE `thong_tin_chung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cotdiem`
--
ALTER TABLE `cotdiem`
  ADD CONSTRAINT `cotdiem_ibfk_1` FOREIGN KEY (`decuong_id`) REFERENCES `decuongchitiet` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `decuongchitiet`
--
ALTER TABLE `decuongchitiet`
  ADD CONSTRAINT `decuongchitiet_ibfk_1` FOREIGN KEY (`hoc_phan_id`) REFERENCES `hocphan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `giangvien`
--
ALTER TABLE `giangvien`
  ADD CONSTRAINT `giangvien_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `hocphan`
--
ALTER TABLE `hocphan`
  ADD CONSTRAINT `FKfigo2rxhsbwngs76nwbn12l00` FOREIGN KEY (`nhom_id`) REFERENCES `nhomkienthuc` (`id`),
  ADD CONSTRAINT `hocphan_ibfk_1` FOREIGN KEY (`nhom_id`) REFERENCES `khungchuongtrinh` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kehoachdayhoc`
--
ALTER TABLE `kehoachdayhoc`
  ADD CONSTRAINT `kehoachdayhoc_ibfk_1` FOREIGN KEY (`ctdt_id`) REFERENCES `thongtinchung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kehoachdayhoc_ibfk_2` FOREIGN KEY (`hoc_phan_id`) REFERENCES `hocphan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kehoachmonhom`
--
ALTER TABLE `kehoachmonhom`
  ADD CONSTRAINT `kehoachmonhom_ibfk_1` FOREIGN KEY (`hoc_phan_id`) REFERENCES `hocphan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `khungchuongtrinh`
--
ALTER TABLE `khungchuongtrinh`
  ADD CONSTRAINT `khungchuongtrinh_ibfk_1` FOREIGN KEY (`ctdt_id`) REFERENCES `thongtinchung` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `khungchuongtrinh_nhomkienthuc`
--
ALTER TABLE `khungchuongtrinh_nhomkienthuc`
  ADD CONSTRAINT `FK9kwc3vve8qsyvxxynm26tphiu` FOREIGN KEY (`khung_chuong_trinh_id`) REFERENCES `khungchuongtrinh` (`id`),
  ADD CONSTRAINT `khungchuongtrinh_nhomkienthuc_ibfk_1` FOREIGN KEY (`id_khungchuongtrinh`) REFERENCES `khungchuongtrinh` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `khungchuongtrinh_nhomkienthuc_ibfk_2` FOREIGN KEY (`id_manhom`) REFERENCES `nhomkienthuc` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `phanconggiangday`
--
ALTER TABLE `phanconggiangday`
  ADD CONSTRAINT `phanconggiangday_ibfk_1` FOREIGN KEY (`nhom_id`) REFERENCES `kehoachmonhom` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phanconggiangday_ibfk_2` FOREIGN KEY (`giang_vien_id`) REFERENCES `giangvien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `FKs6xva6csnux440glxtciecwhe` FOREIGN KEY (`decuong_id`) REFERENCES `outline_detail` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FK55itppkw3i07do3h7qoclqd4k` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKrhfovtciq1l558cw6udg0h0d3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
