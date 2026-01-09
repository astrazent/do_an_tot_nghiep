-- Dữ liệu mẫu cho Roles
INSERT INTO Roles (name, description) VALUES
('admin', 'Quyền quản trị hệ thống, có thể thêm, sửa, xóa dữ liệu và quản lý user'),
('user', 'Quyền người dùng bình thường, chỉ có thể xem và thao tác hạn chế trong hệ thống');

-- Dữ liệu mẫu cho Admins
INSERT INTO Admins (username, email, full_name, password_hash, level, description, role_id) VALUES
('superadmin', 'superadmin@example.com', 'Nguyen Van A', '$2y$10$examplehash1', 3, 'Quản trị viên cao cấp, toàn quyền trên hệ thống', 1),
('admin1', 'admin1@example.com', 'Tran Thi B', '$2y$10$examplehash2', 2, 'Quản lý nội dung và người dùng', 1),
('admin2', 'admin2@example.com', 'Le Van C', '$2y$10$examplehash3', 1, 'Hỗ trợ quản lý vận hành', 1),
('useradmin', 'useradmin@example.com', 'Pham Thi D', '$2a$10$RMTnNJ0gnaUirk7/PnepmusCA8.vZtad.Ty7iBz6/niY9je8Q9y1m', 0, 'Admin cấp thấp, quyền hạn giới hạn', 1);

-- Dữ liệu mẫu cho PostTypes
INSERT INTO PostTypes (name, slug, description) VALUES
('Mẹo hay tiêu dùng', 'meo-hay-tieu-dung', 'Tổng hợp các mẹo vặt hữu ích trong đời sống hàng ngày'),
('Bài viết nổi bật', 'bai-viet-noi-bat', 'Những bài viết được đánh giá nổi bật, quan tâm nhiều nhất'),
('Đặc sản vùng miền', 'dac-san-vung-mien', 'Giới thiệu các đặc sản nổi tiếng từ các vùng miền Việt Nam'),
('Công thức nấu ăn', 'cong-thuc-nau-an', 'Các công thức nấu ăn dễ thực hiện tại nhà'),
('Chăm sóc sức khỏe', 'cham-soc-suc-khoe', 'Mẹo và hướng dẫn chăm sóc sức khỏe và dinh dưỡng'),
('Tin tức ẩm thực', 'tin-tuc-am-thuc', 'Các tin tức mới nhất về ẩm thực, nhà hàng và món ăn');

-- Dữ liệu mẫu cho Posts
INSERT INTO Posts (title, slug, content, author_name, description, status, published_at, admin_id, post_type_id) VALUES
-- post_type_id = 1 (Mẹo hay tiêu dùng)
('Cách tiết kiệm điện hiệu quả cho gia đình', 'cach-tiet-kiem-dien-hieu-qua', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Thị Lan', 'Mẹo tiết kiệm điện hàng ngày', 1, '2025-10-10 08:00:00', 1, 1),
('Bảo quản thực phẩm trong tủ lạnh đúng cách', 'bao-quan-thuc-pham-trong-tu-lanh', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Văn Mạnh', 'Các mẹo bảo quản thực phẩm', 1, '2025-10-10 09:30:00', 2, 1),
('Cách khử mùi hôi trong bếp', 'cach-khu-mui-hoi-trong-bep', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Thị Hà', 'Mẹo khử mùi hôi đơn giản', 1, '2025-10-10 11:00:00', 3, 1),
('Tối ưu không gian nhà cửa nhỏ', 'toi-uu-khong-gian-nha-cua-nho', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Phạm Văn Long', 'Mẹo sắp xếp không gian sống', 1, '2025-10-10 12:30:00', 4, 1),
('Chọn thực phẩm tươi ngon khi đi chợ', 'chon-thuc-pham-tuoi-ngon', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Hoàng Thị Thu', 'Mẹo mua thực phẩm tươi', 1, '2025-10-10 14:00:00', 1, 1),
('Cách bảo quản đồ dùng lâu hỏng', 'cach-bao-quan-do-dung-lau-hong', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Đặng Văn Nam', 'Bí quyết bảo quản đồ dùng', 1, '2025-10-10 15:30:00', 2, 1),
-- post_type_id = 2 (Bài viết nổi bật)
('Những món ăn được săn lùng nhiều nhất', 'nhung-mon-an-duoc-san-lung-nhieu-nhat', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Ngô Văn Bảo', 'Top món ăn nổi bật', 1, '2025-10-11 08:00:00', 1, 2),
('Các nhà hàng hot nhất hiện nay', 'cac-nha-hang-hot-nhat', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Vũ Thị Mai', 'Những nhà hàng được ưa chuộng', 1, '2025-10-11 09:30:00', 2, 2),
('Địa điểm ăn uống đáng thử tại Hà Nội', 'dia-diem-an-uong-dang-thu-ha-noi', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Văn Mạnh', 'Địa điểm ẩm thực nổi bật', 1, '2025-10-11 11:00:00', 3, 2),
('Món tráng miệng được yêu thích', 'mon-trang-mieng-duoc-yeu-thich', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Thị Lan', 'Các món tráng miệng phổ biến', 1, '2025-10-11 12:30:00', 4, 2),
('Xu hướng ẩm thực mới nhất', 'xu-huong-am-thuc-moi-nhat', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Thị Hà', 'Các xu hướng ẩm thực đang hot', 1, '2025-10-11 14:00:00', 1, 2),
('Những công thức nấu ăn được chia sẻ nhiều', 'nhung-cong-thuc-nau-an-duoc-chia-se-nhieu', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Phạm Văn Long', 'Các công thức nấu ăn nổi bật', 1, '2025-10-11 15:30:00', 2, 2),
-- post_type_id = 3 (Đặc sản vùng miền)
('Khám phá đặc sản miền Bắc', 'kham-pha-dac-san-mien-bac', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Văn Dũng', 'Những món ngon miền Bắc', 1, '2025-10-12 08:00:00', 3, 3),
('Đặc sản miền Trung nổi tiếng', 'dac-san-mien-trung-noi-tieng', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Hoàng Văn Nam', 'Các đặc sản miền Trung', 1, '2025-10-12 09:30:00', 4, 3),
('Món ăn đặc sắc miền Nam', 'mon-an-dac-sac-mien-nam', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Minh Hoàng', 'Các món ngon miền Nam', 1, '2025-10-12 11:00:00', 1, 3),
('Ẩm thực Tây Bắc', 'am-thuc-tay-bac', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Thị Lan', 'Đặc sản Tây Bắc', 1, '2025-10-12 12:30:00', 2, 3),
('Ẩm thực Tây Nguyên', 'am-thuc-tay-nguyen', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Thị Lan', 'Các món ăn Tây Nguyên', 1, '2025-10-12 14:00:00', 3, 3),
('Đặc sản ven biển miền Trung', 'dac-san-ven-bien-mien-trung', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Phạm Thị Hương', 'Các hải sản đặc trưng', 1, '2025-10-12 15:30:00', 4, 3),
-- post_type_id = 4 (Công thức nấu ăn)
('Công thức món canh đơn giản', 'cong-thuc-mon-canh-don-gian', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Hoàng Thị Thu', 'Hướng dẫn nấu canh', 1, '2025-10-13 08:00:00', 1, 4),
('Công thức món xào nhanh', 'cong-thuc-mon-xao-nhanh', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Đặng Văn Nam', 'Hướng dẫn nấu món xào', 1, '2025-10-13 09:30:00', 2, 4),
('Công thức món chiên giòn', 'cong-thuc-mon-chien-gion', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Thị Lan', 'Hướng dẫn chiên món ngon', 1, '2025-10-13 11:00:00', 3, 4),
('Công thức món hấp', 'cong-thuc-mon-hap', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Phạm Văn Long', 'Hướng dẫn hấp đơn giản', 1, '2025-10-13 12:30:00', 4, 4),
('Công thức món nướng', 'cong-thuc-mon-nuong', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Văn Mạnh', 'Hướng dẫn nướng món ngon', 1, '2025-10-13 14:00:00', 1, 4),
('Công thức món trộn', 'cong-thuc-mon-tron', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Thị Hà', 'Hướng dẫn trộn món ăn', 1, '2025-10-13 15:30:00', 2, 4),
-- post_type_id = 5 (Chăm sóc sức khỏe)
('Lợi ích của việc uống nước đúng cách', 'loi-ich-cua-viec-uong-nuoc-dung-cach', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Văn Dũng', 'Cách uống nước tốt cho sức khỏe', 1, '2025-10-14 08:00:00', 3, 5),
('Bài tập thể dục buổi sáng', 'bai-tap-the-duc-buoi-sang', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Hoàng Thị Thu', 'Các bài tập sáng khỏe mạnh', 1, '2025-10-14 09:30:00', 1, 5),
('Chế độ ăn uống lành mạnh', 'che-do-an-uong-lanh-manh', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Văn Mạnh', 'Hướng dẫn ăn uống khoa học', 1, '2025-10-14 11:00:00', 2, 5),
('Thói quen ngủ đủ giấc', 'thoi-quen-ngu-du-giac', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Phạm Thị Hương', 'Bí quyết ngủ ngon', 1, '2025-10-14 12:30:00', 3, 5),
('Giảm stress hiệu quả', 'giam-stress-hieu-qua', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Minh Hoàng', 'Các phương pháp giảm stress', 1, '2025-10-14 14:00:00', 4, 5),
('Các loại thực phẩm bổ sung', 'cac-loai-thuc-pham-bo-sung', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Ngô Văn Bảo', 'Thực phẩm bổ sung cho cơ thể', 1, '2025-10-14 15:30:00', 1, 5),
-- post_type_id = 6 (Tin tức ẩm thực)
('Tin tức ẩm thực hôm nay', 'tin-tuc-am-thuc-hom-nay', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Nguyễn Thị Lan', 'Các tin tức mới nhất', 1, '2025-10-15 08:00:00', 2, 6),
('Xu hướng ẩm thực 2025', 'xu-huong-am-thuc-2025', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Trần Văn Mạnh', 'Những xu hướng nổi bật năm 2025', 1, '2025-10-15 09:30:00', 3, 6),
('Nhà hàng mở mới tại Hà Nội', 'nha-hang-mo-moi-ha-noi', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Lê Thị Hà', 'Thông tin nhà hàng mới', 1, '2025-10-15 11:00:00', 4, 6),
('Đặc sản Việt Nam được ưa chuộng', 'dac-san-viet-nam-duoc-ua-chuong', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Hoàng Thị Thu', 'Top đặc sản Việt Nam', 1, '2025-10-15 12:30:00', 1, 6),
('Sự kiện ẩm thực cuối tuần', 'su-kien-am-thuc-cuoi-tuan', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Đặng Văn Nam', 'Các sự kiện ẩm thực nổi bật', 1, '2025-10-15 14:00:00', 2, 6),
('Món ăn đường phố hấp dẫn', 'mon-an-duong-pho-hap-dan', '<p>Xúc xích cốm là món ăn truyền thống đặc sắc của Hà Nội, nổi bật với hương vị độc đáo.</p>\n\n<p>[IMAGE_1]</p>\n\n<p>Thịt heo tươi kết hợp với cốm non tạo ra hương vị dẻo thơm khó quên, phù hợp với mọi bữa ăn gia đình.</p>\n\n<p>[IMAGE_2]</p>\n\n<p>Ngày nay, món ăn này được nhiều quán đặc sản và siêu thị giới thiệu rộng rãi, trở thành lựa chọn yêu thích của nhiều người.</p>', 'Ngô Văn Bảo', 'Các món ăn đường phố đặc sắc', 1, '2025-10-15 15:30:00', 3, 6);

-- Dữ liệu mẫu cho PostImages
INSERT INTO PostImages (post_id, image_url, is_main, display_order, caption, alt_text, created_at, updated_at) VALUES
(1,'https://i.postimg.cc/wj6wBvPR/images.png',1,0,'Ảnh chính bài viết 1','Thumbnail bài viết 1','2025-12-29 23:14:35','2025-12-30 23:38:49'),
(1,'https://i.postimg.cc/wj6wBvPR/images.png',0,1,'Ảnh phụ 1 bài viết 1','Ảnh phụ 1 bài viết 1','2025-12-29 23:14:35','2026-01-08 23:45:48'),
(1,'https://i.postimg.cc/wj6wBvPR/images.png',0,2,'Ảnh phụ 2 bài viết 1','Ảnh phụ 2 bài viết 1','2025-12-29 23:14:35','2026-01-08 23:45:48'),

(2,'https://i.postimg.cc/W4d6DJ7n/11-resize.jpg',1,0,'Ảnh chính bài viết 2','Thumbnail bài viết 2','2025-12-29 23:14:35','2025-12-30 23:40:17'),
(2,'https://i.postimg.cc/W4d6DJ7n/11-resize.jpg',0,1,'Ảnh phụ 1 bài viết 2','Ảnh phụ 1 bài viết 2','2025-12-29 23:14:35','2026-01-08 23:45:53'),

(3,'https://i.postimg.cc/9FX9R7mW/tai-xuong-(10).jpg',1,0,'Ảnh chính bài viết 3','Thumbnail bài viết 3','2025-12-29 23:14:35','2025-12-30 23:41:08'),
(3,'https://i.postimg.cc/9FX9R7mW/tai-xuong-(10).jpg',0,1,'Ảnh phụ 1 bài viết 3','Ảnh phụ 1 bài viết 3','2025-12-29 23:14:35','2026-01-08 23:45:59'),
(3,'https://i.postimg.cc/9FX9R7mW/tai-xuong-(10).jpg',0,2,'Ảnh phụ 2 bài viết 3','Ảnh phụ 2 bài viết 3','2025-12-29 23:14:35','2026-01-08 23:45:59'),

(4,'https://khonggiandep.com.vn/wp-content/uploads/2021/04/Toi-uu-hoa.jpg',1,0,'Ảnh chính bài viết 4','Thumbnail bài viết 4','2025-12-29 23:14:35','2026-01-08 23:44:41'),
(4,'https://khonggiandep.com.vn/wp-content/uploads/2021/04/Toi-uu-hoa.jpg',0,1,'Ảnh phụ 1 bài viết 4','Ảnh phụ 1 bài viết 4','2025-12-29 23:14:35','2026-01-08 23:46:04'),

(5,'https://i.postimg.cc/hhFP0NFh/tai-xuong-(18).jpg',1,0,'Ảnh chính bài viết 5','Thumbnail bài viết 5','2025-12-29 23:14:35','2025-12-30 23:56:10'),
(5,'https://i.postimg.cc/hhFP0NFh/tai-xuong-(18).jpg',0,1,'Ảnh phụ 1 bài viết 5','Ảnh phụ 1 bài viết 5','2025-12-29 23:14:35','2026-01-08 23:46:11'),

(6,'https://i.postimg.cc/L5JnDznv/tai-xuong-(17).jpg',1,0,'Ảnh chính bài viết 6','Thumbnail bài viết 6','2025-12-29 23:14:35','2025-12-30 23:55:30'),
(6,'https://i.postimg.cc/L5JnDznv/tai-xuong-(17).jpg',0,1,'Ảnh phụ 1 bài viết 6','Ảnh phụ 1 bài viết 6','2025-12-29 23:14:35','2026-01-08 23:46:16'),
(6,'https://i.postimg.cc/L5JnDznv/tai-xuong-(17).jpg',0,2,'Ảnh phụ 2 bài viết 6','Ảnh phụ 2 bài viết 6','2025-12-29 23:14:35','2026-01-08 23:46:16'),

(7,'https://statics.vinpearl.com/dac-san-ha-noi-0_1684417727.jpg',1,0,'Ảnh chính bài viết 7','Thumbnail bài viết 7','2025-12-29 23:14:35','2026-01-08 23:30:25'),
(7,'https://statics.vinpearl.com/dac-san-ha-noi-0_1684417727.jpg',0,1,'Ảnh phụ 1 bài viết 7','Ảnh phụ 1 bài viết 7','2025-12-29 23:14:35','2026-01-08 23:46:20'),

(8,'https://cuonnroll.com/wp-content/uploads/2019/11/ava.jpg.webp',1,0,'Ảnh chính bài viết 8','Thumbnail bài viết 8','2025-12-29 23:14:35','2026-01-08 23:31:33'),
(8,'https://cuonnroll.com/wp-content/uploads/2019/11/ava.jpg.webp',0,1,'Ảnh phụ 1 bài viết 8','Ảnh phụ 1 bài viết 8','2025-12-29 23:14:35','2026-01-08 23:46:25'),
(8,'https://cuonnroll.com/wp-content/uploads/2019/11/ava.jpg.webp',0,2,'Ảnh phụ 2 bài viết 8','Ảnh phụ 2 bài viết 8','2025-12-29 23:14:35','2026-01-08 23:46:25'),

(9,'https://i.postimg.cc/MZBw7PG1/tai-xuong-(14).jpg',1,0,'Ảnh chính bài viết 9','Thumbnail bài viết 9','2025-12-29 23:14:35','2025-12-30 23:48:24'),
(9,'https://i.postimg.cc/MZBw7PG1/tai-xuong-(14).jpg',0,1,'Ảnh phụ 1 bài viết 9','Ảnh phụ 1 bài viết 9','2025-12-29 23:14:35','2026-01-08 23:46:28'),

(10,'https://i.postimg.cc/J0XRtKyr/tai-xuong-(13).jpg',1,0,'Ảnh chính bài viết 10','Thumbnail bài viết 10','2025-12-29 23:14:35','2025-12-30 23:47:42'),
(10,'https://i.postimg.cc/J0XRtKyr/tai-xuong-(13).jpg',0,1,'Ảnh phụ 1 bài viết 10','Ảnh phụ 1 bài viết 10','2025-12-29 23:14:35','2026-01-08 23:46:32'),

(11,'https://i.postimg.cc/6683Dfp4/tai-xuong-(12).jpg',1,0,'Ảnh chính bài viết 11','Thumbnail bài viết 11','2025-12-29 23:14:35','2025-12-30 23:46:40'),
(11,'https://i.postimg.cc/6683Dfp4/tai-xuong-(12).jpg',0,1,'Ảnh phụ 1 bài viết 11','Ảnh phụ 1 bài viết 11','2025-12-29 23:14:35','2026-01-08 23:46:38'),

(12,'https://i.ytimg.com/vi/HPrnWHhxrkw/maxresdefault.jpg',1,0,'Ảnh chính bài viết 12','Thumbnail bài viết 12','2025-12-29 23:14:35','2026-01-08 23:44:02'),
(12,'https://i.ytimg.com/vi/HPrnWHhxrkw/maxresdefault.jpg',0,1,'Ảnh phụ 1 bài viết 12','Ảnh phụ 1 bài viết 12','2025-12-29 23:14:35','2026-01-08 23:46:41'),

(13,'https://smiletravel.com.vn/wp-content/uploads/2025/01/mien-bac-mon-an-ngon.jpg',1,0,'Ảnh chính bài viết 13','Thumbnail bài viết 13','2025-12-29 23:14:35','2026-01-08 23:32:48'),
(13,'https://smiletravel.com.vn/wp-content/uploads/2025/01/mien-bac-mon-an-ngon.jpg',0,1,'Ảnh phụ 1 bài viết 13','Ảnh phụ 1 bài viết 13','2025-12-29 23:14:35','2026-01-08 23:46:44'),

(14,'https://bizweb.dktcdn.net/100/349/716/files/dac-san-mien-trung-thumb-1.jpg?v=1742530475712',1,0,'Ảnh chính bài viết 14','Thumbnail bài viết 14','2025-12-29 23:14:35','2026-01-08 23:33:33'),
(14,'https://bizweb.dktcdn.net/100/349/716/files/dac-san-mien-trung-thumb-1.jpg?v=1742530475712',0,1,'Ảnh phụ 1 bài viết 14','Ảnh phụ 1 bài viết 14','2025-12-29 23:14:35','2026-01-08 23:46:48'),

(15,'https://r2.nucuoimekong.com/wp-content/uploads/mon-ngon-mien-nam.jpg',1,0,'Ảnh chính bài viết 15','Thumbnail bài viết 15','2025-12-29 23:14:35','2026-01-08 23:34:21'),
(15,'https://r2.nucuoimekong.com/wp-content/uploads/mon-ngon-mien-nam.jpg',0,1,'Ảnh phụ 1 bài viết 15','Ảnh phụ 1 bài viết 15','2025-12-29 23:14:35','2026-01-08 23:46:52'),

(16,'https://images.baodantoc.vn/uploads/2024/Thang-7/Ngay-18/Bang-Ngan/1t41.jpg',1,0,'Ảnh chính bài viết 16','Thumbnail bài viết 16','2025-12-29 23:14:35','2026-01-08 23:34:57'),
(16,'https://images.baodantoc.vn/uploads/2024/Thang-7/Ngay-18/Bang-Ngan/1t41.jpg',0,1,'Ảnh phụ 1 bài viết 16','Ảnh phụ 1 bài viết 16','2025-12-29 23:14:35','2026-01-08 23:46:56'),

(17,'https://haidangtravel.com/image/blog/am-thuc-tay-nguyen.jpg',1,0,'Ảnh chính bài viết 17','Thumbnail bài viết 17','2025-12-29 23:14:35','2026-01-08 23:36:04'),
(17,'https://haidangtravel.com/image/blog/am-thuc-tay-nguyen.jpg',0,1,'Ảnh phụ 1 bài viết 17','Ảnh phụ 1 bài viết 17','2025-12-29 23:14:35','2026-01-08 23:46:59'),

(18,'https://statics.vinpearl.com/dac-san-mien-trung-1_1635331847.jpg',1,0,'Ảnh chính bài viết 18','Thumbnail bài viết 18','2025-12-29 23:14:35','2026-01-08 23:36:28'),
(18,'https://statics.vinpearl.com/dac-san-mien-trung-1_1635331847.jpg',0,1,'Ảnh phụ 1 bài viết 18','Ảnh phụ 1 bài viết 18','2025-12-29 23:14:35','2026-01-08 23:47:02'),

(19,'https://www.btaskee.com/wp-content/uploads/2023/03/cac-mon-canh-ngon.jpg',1,0,'Ảnh chính bài viết 19','Thumbnail bài viết 19','2025-12-29 23:14:35','2026-01-08 23:36:55'),
(19,'https://www.btaskee.com/wp-content/uploads/2023/03/cac-mon-canh-ngon.jpg',0,1,'Ảnh phụ 1 bài viết 19','Ảnh phụ 1 bài viết 19','2025-12-29 23:14:35','2026-01-08 23:47:05'),

(20,'https://nuocmamtin.com/wp-content/uploads/2022/08/thumbnail-2.jpg',1,0,'Ảnh chính bài viết 20','Thumbnail bài viết 20','2025-12-29 23:14:35','2026-01-08 23:37:15'),
(20,'https://nuocmamtin.com/wp-content/uploads/2022/08/thumbnail-2.jpg',0,1,'Ảnh phụ 1 bài viết 20','Ảnh phụ 1 bài viết 20','2025-12-29 23:14:35','2026-01-08 23:47:10'),

(21,'https://cdn.tgdd.vn/2021/11/CookDish/tong-hop-28-cach-lam-cac-mon-chien-xu-de-lam-hap-dan-an-la-avt-1200x676.jpg',1,0,'Ảnh chính bài viết 21','Thumbnail bài viết 21','2025-12-29 23:14:35','2026-01-08 23:38:36'),
(21,'https://cdn.tgdd.vn/2021/11/CookDish/tong-hop-28-cach-lam-cac-mon-chien-xu-de-lam-hap-dan-an-la-avt-1200x676.jpg',0,1,'Ảnh phụ 1 bài viết 21','Ảnh phụ 1 bài viết 21','2025-12-29 23:14:35','2026-01-08 23:47:13'),

(22,'https://i.ytimg.com/vi/T4E8lkcvP10/hq720.jpg',1,0,'Ảnh chính bài viết 22','Thumbnail bài viết 22','2025-12-29 23:14:35','2026-01-08 23:37:52'),
(22,'https://i.ytimg.com/vi/T4E8lkcvP10/hq720.jpg',0,1,'Ảnh phụ 1 bài viết 22','Ảnh phụ 1 bài viết 22','2025-12-29 23:14:35','2026-01-08 23:47:20'),

(23,'https://bizweb.dktcdn.net/100/603/550/articles/cac-mon-nuong-ngon-anh-bia.jpg',1,0,'Ảnh chính bài viết 23','Thumbnail bài viết 23','2025-12-29 23:14:35','2026-01-08 23:39:01'),
(23,'https://bizweb.dktcdn.net/100/603/550/articles/cac-mon-nuong-ngon-anh-bia.jpg',0,1,'Ảnh phụ 1 bài viết 23','Ảnh phụ 1 bài viết 23','2025-12-29 23:14:35','2026-01-08 23:47:24'),

(24,'https://i.ytimg.com/vi/wzfcSoeG3_E/maxresdefault.jpg',1,0,'Ảnh chính bài viết 24','Thumbnail bài viết 24','2025-12-29 23:14:35','2026-01-08 23:39:23'),
(24,'https://i.ytimg.com/vi/wzfcSoeG3_E/maxresdefault.jpg',0,1,'Ảnh phụ 1 bài viết 24','Ảnh phụ 1 bài viết 24','2025-12-29 23:14:35','2026-01-08 23:47:34'),

(25,'https://karofivietnam.com.vn/media/news/0412_loi-ich.jpg',1,0,'Ảnh chính bài viết 25','Thumbnail bài viết 25','2025-12-29 23:14:35','2026-01-08 23:39:44'),
(25,'https://karofivietnam.com.vn/media/news/0412_loi-ich.jpg',0,1,'Ảnh phụ 1 bài viết 25','Ảnh phụ 1 bài viết 25','2025-12-29 23:14:35','2026-01-08 23:47:39'),

(26,'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/10/8/1251585/Mo-Bung.jpg',1,0,'Ảnh chính bài viết 26','Thumbnail bài viết 26','2025-12-29 23:14:35','2026-01-08 23:40:06'),
(26,'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/10/8/1251585/Mo-Bung.jpg',0,1,'Ảnh phụ 1 bài viết 26','Ảnh phụ 1 bài viết 26','2025-12-29 23:14:35','2026-01-08 23:47:42'),

(27,'https://suckhoedoisong.qltns.mediacdn.vn/Images/nguyenkhanh/2020/11/12/T10.11.M-Nen_n_a_dng_cac_loi_thc_phm.jpg',1,0,'Ảnh chính bài viết 27','Thumbnail bài viết 27','2025-12-29 23:14:35','2026-01-08 23:40:23'),
(27,'https://suckhoedoisong.qltns.mediacdn.vn/Images/nguyenkhanh/2020/11/12/T10.11.M-Nen_n_a_dng_cac_loi_thc_phm.jpg',0,1,'Ảnh phụ 1 bài viết 27','Ảnh phụ 1 bài viết 27','2025-12-29 23:14:35','2026-01-08 23:47:47'),

(28,'https://porticoandbridge.com/wp-content/uploads/2023/05/blog6.png',1,0,'Ảnh chính bài viết 28','Thumbnail bài viết 28','2025-12-29 23:14:35','2026-01-08 23:41:11'),
(28,'https://porticoandbridge.com/wp-content/uploads/2023/05/blog6.png',0,1,'Ảnh phụ 1 bài viết 28','Ảnh phụ 1 bài viết 28','2025-12-29 23:14:35','2026-01-08 23:47:51'),

(29,'https://tamanhhospital.vn/wp-content/uploads/2023/10/xa-stress.jpg',1,0,'Ảnh chính bài viết 29','Thumbnail bài viết 29','2025-12-29 23:14:35','2026-01-08 23:41:27'),
(29,'https://tamanhhospital.vn/wp-content/uploads/2023/10/xa-stress.jpg',0,1,'Ảnh phụ 1 bài viết 29','Ảnh phụ 1 bài viết 29','2025-12-29 23:14:35','2026-01-08 23:47:54'),

(30,'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/12/14/thuc-pham-phong-ung-thu-2-16710086892401444444502.jpg',1,0,'Ảnh chính bài viết 30','Thumbnail bài viết 30','2025-12-29 23:14:35','2026-01-08 23:41:44'),
(30,'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/12/14/thuc-pham-phong-ung-thu-2-16710086892401444444502.jpg',0,1,'Ảnh phụ 1 bài viết 30','Ảnh phụ 1 bài viết 30','2025-12-29 23:14:35','2026-01-08 23:47:58'),

(31,'https://res.klook.com/image/upload/q_85/c_fill,w_750/v1714042111/v1aisfwz1i19ef2j9cj6.jpg',1,0,'Ảnh chính bài viết 31','Thumbnail bài viết 31','2025-12-29 23:14:35','2026-01-08 23:42:04'),
(31,'https://res.klook.com/image/upload/q_85/c_fill,w_750/v1714042111/v1aisfwz1i19ef2j9cj6.jpg',0,1,'Ảnh phụ 1 bài viết 31','Ảnh phụ 1 bài viết 31','2025-12-29 23:14:35','2026-01-08 23:48:01'),

(32,'https://hotelacademy.vn/wp-content/uploads/2025/02/xu-huong-am-thuc-2025-mau-xam.webp',1,0,'Ảnh chính bài viết 32','Thumbnail bài viết 32','2025-12-29 23:14:35','2026-01-08 23:42:25'),
(32,'https://hotelacademy.vn/wp-content/uploads/2025/02/xu-huong-am-thuc-2025-mau-xam.webp',0,1,'Ảnh phụ 1 bài viết 32','Ảnh phụ 1 bài viết 32','2025-12-29 23:14:35','2026-01-08 23:48:05'),

(33,'https://dntt.mediacdn.vn/197608888129458176/2023/1/9/2973253201008575027368888519862769220158708n-16732545646092015282612.jpg',1,0,'Ảnh chính bài viết 33','Thumbnail bài viết 33','2025-12-29 23:14:35','2026-01-08 23:42:48'),
(33,'https://dntt.mediacdn.vn/197608888129458176/2023/1/9/2973253201008575027368888519862769220158708n-16732545646092015282612.jpg',0,1,'Ảnh phụ 1 bài viết 33','Ảnh phụ 1 bài viết 33','2025-12-29 23:14:35','2026-01-08 23:48:08'),

(34,'https://i.postimg.cc/L6q13M1y/tai-xuong-(16).jpg',1,0,'Ảnh chính bài viết 34','Thumbnail bài viết 34','2025-12-29 23:14:35','2025-12-30 23:54:40'),
(34,'https://i.postimg.cc/L6q13M1y/tai-xuong-(16).jpg',0,1,'Ảnh phụ 1 bài viết 34','Ảnh phụ 1 bài viết 34','2025-12-29 23:14:35','2026-01-08 23:48:11'),

(35,'https://i.postimg.cc/dtD8NybY/tai-xuong-(15).jpg',1,0,'Ảnh chính bài viết 35','Thumbnail bài viết 35','2025-12-29 23:14:35','2025-12-30 23:54:05'),
(35,'https://i.postimg.cc/dtD8NybY/tai-xuong-(15).jpg',0,1,'Ảnh phụ 1 bài viết 35','Ảnh phụ 1 bài viết 35','2025-12-29 23:14:35','2026-01-08 23:48:14'),

(36,'https://i.postimg.cc/C5cV6tnm/tai-xuong-(8).jpg',1,0,'Ảnh chính bài viết 36','Thumbnail bài viết 36','2025-12-29 23:14:35','2025-12-30 23:35:45'),
(36,'https://i.postimg.cc/C5cV6tnm/tai-xuong-(8).jpg',0,1,'Ảnh phụ 1 bài viết 36','Ảnh phụ 1 bài viết 36','2025-12-29 23:14:35','2026-01-08 23:48:22');

-- Dữ liệu mẫu cho Categories
INSERT INTO Categories (id, name, slug, description, parent_id) VALUES
(1, 'Thực phẩm khác', 'thuc-pham-khac', 'Tổng hợp các món ăn, sản vật đặc trưng của các địa phương trên cả nước.', NULL),
(2, 'Hải sản', 'hai-san', 'Các món ăn được chế biến sẵn từ hải sản tươi sống.', NULL),
(3, 'Ruốc', 'ruoc', 'Ruốc (chà bông) làm từ các loại thịt, cá, tôm.', NULL),
(4, 'Sản phẩm từ gà', 'san-pham-tu-ga', 'Các món ăn ngon được chế biến từ thịt gà.', NULL),
(5, 'Các loại hạt', 'cac-loai-hat', 'Tổng hợp các loại hạt sấy khô, rang muối tốt cho sức khỏe.', NULL),
(6, 'Sản phẩm từ vịt', 'san-pham-tu-vit', 'Các món ăn ngon được chế biến từ thịt vịt.', NULL),
(7, 'Sản phẩm từ cá', 'san-pham-tu-ca', 'Các món ăn được chế biến sẵn từ cá nước ngọt và cá biển.', NULL),
(8, 'Sản phẩm từ heo', 'san-pham-tu-heo', 'Các món ăn ngon được chế biến từ thịt heo.', NULL),
(9, 'Sản phẩm từ ngan', 'san-pham-tu-ngan', 'Các món ăn ngon được chế biến từ thịt ngan.', NULL);

-- Dữ liệu mẫu cho PostCategories
INSERT INTO PostCategories (post_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8);

-- Dữ liệu mẫu cho Users
INSERT INTO Users (`username`,`password_hash`,`provider`,`provider_id`,`email`,`phone`,`full_name`,`gender`,`address`,`city`,`district`,`ward`,`avatar_url`,`status`) VALUES
('hoangnam','$2a$10$.RiX67BDw3k4Uw22rewLJ.KrZfOD0PdIGqc9DUUl4RZatU61f4gaa','local',NULL,'hoangnam@gmail.com','0912345678','Hoàng Nam','male','12B Thanh Xuân Nam','Ha Noi','Quan Thanh Xuan','Phuong Thanh Xuan Nam','https://i.ex-cdn.com/danviet.vn/files/content/2025/12/15/114032532428448_1311331283687385_8086819611126358303_n-1140.jpg',1),
('phoducnam','$2a$10$oa596XbyvbHkScXJggYg5uFXWyRNYC.BdDKE6UHeXGWhbVeWM30Wy','local',NULL,'phoducnam@gmail.com','0987654321','Phó Đức Nam','male','45 Trần Duy Hưng','Ha Noi','Quan Cau Giay','Phuong Trung Hoa','https://media.vov.vn/sites/default/files/styles/front_large/public/2025-08/Pho-Duc-Nam-Mr-Pips.jpg',1),
('binhgold','$2a$10$8G72fEPvu.cUDTN50lAk9ef3Hvwae8kC.D11QxMYQr7MBh38bmHhy','local',NULL,'binhgold@gmail.com','0903456789','Bình Gold','male','789 Nguyễn Chí Thanh','Ha Noi','Quan Dong Da','Phuong Lang Thuong','https://media.vov.vn/sites/default/files/styles/large/public/2025-07/binh_gold.jpg',0),
('chidan','$2a$10$WpCHIYYXjYEaTDWx1BYnd.xiS85olPsigfI9W0m3GRrbTN/YK7D6K','local',NULL,'chidan@gmail.com','0904567890','Chi Dân','male','101 Láng Hạ','Ha Noi','Quan Ba Dinh','Phuong Thanh Cong','https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/11/10/ca-si-chi-dan-1731220120935967588336.jpg',1),
('sharkthuy','$2a$10$L9.OA7ociHXQAOQE46UUeufy2QOi.sJ3pDgdqNNoJummTA6H5p1c2','local',NULL,'sharkthuy@gmail.com','0905678901','Nguyễn Ngọc Thủy','female','202 Tôn Đức Thắng','Ha Noi','Quan Dong Da','Phuong Hang Bot','https://media.vov.vn/sites/default/files/styles/large/public/2025-11/z7234084082652_475067ff357d08a06d14359b42d1783e-1837.jpg',1),
('sharkbinh','$2a$10$TmrNsumGD2Ttdoxf8LCFcOGwW5iCNJ2n.R6yo612vovsZ4bxIwnwC','local',NULL,'sharkbinh@gmail.com','0915111222','Nguyễn Hòa Bình','male','55 Nguyễn Lương Bằng','Ha Noi','Quan Dong Da','Phuong Quang Trung','https://mediabls.mediatech.vn/upload/image/202510/medium/597581_df2ab94767e09137cd020ff780d01d3a.jpg',1),
('damvinhhung','$2a$10$fulj8uZoGsYremHzos.eDuApDVHlOdvbc0cx8HAgNDj9rdHVxftE2','local',NULL,'damvinhhung@gmail.com','0978888999','Đàm Vĩnh Hưng','male','88 Lò Đúc','Ha Noi','Quan Hai Ba Trung','Phuong Dong Mac','https://media-cdn-v2.laodong.vn/storage/newsportal/2024/7/17/1367616/Dam-Vinh-Hung-Medium.jpeg',1),
('thuytien','$2a$10$mS3vKfM8b86QdFtAB86KQecZ13j9xg70A3h41/eZDSCSKS7fXte0O','local',NULL,'thuytien@gmail.com','0355123456','Nguyễn Thúc Thùy Tiên','female','15 Hàng Bài','Ha Noi','Quan Hoan Kiem','Phuong Hang Bai','https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2025/4/8/csacsacs-17440821489931827411440.png',0),
('ngoctrinh','$2a$10$QYKYYBCSJywmw/sKSSoy2uAKJDeFfakXNbVVWzPyfCgTXdFSgYwCa','local',NULL,'ngoct rinh@gmail.com','0368246810','Ngọc Trinh','female','334 Nguyễn Trãi','Ha Noi','Quan Thanh Xuan','Phuong Thanh Xuan Trung','https://media.vov.vn/sites/default/files/styles/large/public/2024-01/ngoc_trinh.jpeg.jpg',1),
('quanglinh','$2a$10$o9mNPculqAv1YtdLhVuIKu3oOVv9nf0aTKK2ABmi6GXSd88YVyqxq','local',NULL,'quanglinh@gmail.com','0918777888','Phạm Quang Linh','male','18 Lý Thường Kiệt','Ha Noi','Quan Hoan Kiem','Phuong Phan Chu Trinh','https://images2.thanhnien.vn/quang-linh-vlog.jpg',1),
('nnn','$2a$10$RMTnNJ0gnaUirk7/PnepmusCA8.vZtad.Ty7iBz6/niY9je8Q9y1m','local',NULL,'hoailinh@gmail.com','0918777882','Hoài Linh','male','18 Lý Thường Kiệt','Thành phố Hà Nội','Quận Thanh Xuân','Phường Thanh Xuân Bắc','https://vcdn1-giaitri.vnecdn.net/2025/08/25/hoai-linh-top-1-1756132802-2224-1756133408.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=5x16Fw6oj-YlAEY4BEDDhg',1);

-- Dữ liệu mẫu cho Tokens
INSERT INTO Tokens (`user_id`, `refresh_token`, `device_info`, `ip_address`, `token_started_at`, `token_expired_at`, `is_revoked`, `revoked_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5ndXllbjU1IiwiaWF0IjoxNzM1Njg5NjAwfQ.fake_token_for_user1', 'Chrome on Windows 11', '192.168.1.10', '2025-01-01 00:00:00', '2026-01-01 00:00:00', FALSE, NULL),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1pbmhUdWFuODkiLCJpYXQiOjE3Mzg0NTQ0MDB9.fake_token_for_user2', 'Safari on macOS Sonoma', '10.0.0.5', '2025-02-01 00:00:00', '2026-02-01 00:00:00', FALSE, NULL),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhvYW5nTG9uZ0hOIiwiaWF0IjoxNzQwOTYwMDAwfQ.fake_token_for_user3', 'Firefox on Linux', '172.16.0.20', '2025-03-01 00:00:00', '2025-09-01 00:00:00', FALSE, NULL),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1haVBodW9uZzk1IiwiaWF0IjoxNzQzNTY4MDAwfQ.fake_token_for_user4', 'Edge on Windows 11', '192.168.1.15', '2025-04-01 00:00:00', '2026-04-01 00:00:00', FALSE, NULL),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlF1YW5nSHV5RGV2IiwiaWF0IjoxNzQ2MTc2MDAwfQ.fake_token_for_user5', 'Chrome on Android 13', '192.168.2.100', '2025-05-01 00:00:00', '2026-05-01 00:00:00', FALSE, NULL),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRoYW5oVGhhbzciLCJpYXQiOjE3NDg4NzY4MDB9.revoked_token_for_user6', 'Safari on iOS 17', '10.10.10.10', '2025-06-01 00:00:00', '2026-06-01 00:00:00', TRUE, '2025-06-15 10:30:00'),
(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR1Y0FuaExlIiwiaWF0IjoxNzUxNDg0ODAwfQ.fake_token_for_user7', 'Brave on Windows 11', '203.0.113.25', '2025-07-01 00:00:00', '2026-07-01 00:00:00', FALSE, NULL),
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5nb2NCaWNoMjAwMCIsImlhdCI6MTc1NDE4MjQwMH0.expired_token_for_user8', 'Chrome on macOS', '198.51.100.2', '2025-08-01 00:00:00', '2025-11-01 00:00:00', FALSE, NULL),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRydW5nRHVuZ0lUIiwiaWF0IjoxNzU2ODc2ODAwfQ.fake_token_for_user9', 'Firefox on Windows 10', '192.168.1.50', '2025-09-01 00:00:00', '2026-09-01 00:00:00', FALSE, NULL),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkxpbmhDaGlCZWF1dHkiLCJpYXQiOjE3NTk0ODQ4MDB9.fake_token_for_user10', 'Safari on iPhone 15 Pro', '172.17.0.5', '2025-10-01 00:00:00', '2026-10-01 00:00:00', FALSE, NULL),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5nbyBOZ29jIE5ndXllbiIsImlhdCI6MTc1OTQ4NDgwMH0.fake_token_for_user11', 'Chrome on Ubuntu 24.04', '10.0.1.12', '2025-10-01 00:00:00', '2026-10-01 00:00:00', FALSE, NULL);

-- Dữ liệu mẫu cho Products
INSERT INTO Products (id, name, slug, description, origin_price, price, import_price, buyed, rate_point_total, rate_count, stock_qty, low_stock_threshold, status, ocop_rating, category_id)
VALUES
    (1, 'Bánh pía Sóc Trăng', 'banh-pia-soc-trang', 'Bánh pía Sóc Trăng thơm ngon, đặc sản miền Tây với lớp vỏ mỏng và nhân đậu xanh sầu riêng béo ngậy.', 70000.00, 65000.00, 50000.00, 150, 29, 6, 200, 20, 1, 4, 1),
    (2, 'Bò một nắng Krông Pa', 'bo-mot-nang-krong-pa', 'Đặc sản bò một nắng Krông Pa, thịt bò tươi được tẩm ướp gia vị đậm đà và phơi qua một nắng giòn.', 550000.00, 525000.00, 450000.00, 80, 20, 5, 100, 10, 1, NULL, 1),
    (3, 'Cà phê Buôn Ma Thuột', 'ca-phe-buon-ma-thuot', 'Cà phê rang xay nguyên chất từ thủ phủ cà phê Buôn Ma Thuột, hương thơm nồng nàn, vị đậm đà.', 150000.00, 135000.00, 110000.00, 250, 23, 6, 300, 30, 1, 4, 1),
    (4, 'Chả ốc', 'cha-oc', 'Chả ốc dai giòn sần sật, kết hợp giữa thịt ốc tươi và các loại gia vị truyền thống, món ngon khó cưỡng.', 120000.00, 110000.00, 90000.00, 120, 25, 5, 150, 15, 1, NULL, 1),
    (5, 'Dê chiên giòn Tây Ninh', 'de-chien-gion-tay-ninh', 'Thịt dê tươi được chế biến theo công thức đặc biệt của Tây Ninh, chiên giòn rụm, thơm nức mũi.', 250000.00, 230000.00, 200000.00, 60, 19, 5, 80, 10, 1, NULL, 1),
    (6, 'Gân bò rau tiến vua', 'gan-bo-rau-tien-vua', 'Món gỏi gân bò giòn sần sật kết hợp với rau tiến vua thanh mát, nước sốt chua ngọt đậm vị.', 180000.00, 175000.00, 150000.00, 90, 7, 3, 120, 10, 1, 3, 1),
    (7, 'Hạt điều rang muối Bình Phước', 'hat-dieu-rang-muoi-binh-phuoc', 'Hạt điều Bình Phước loại 1, được rang muối thủ công, giữ trọn vị bùi béo và hương thơm tự nhiên.', 300000.00, 280000.00, 240000.00, 300, 25, 5, 400, 40, 1, 4, 1),
    (8, 'Mắm tép chưng thịt', 'mam-tep-chung-thit', 'Mắm tép chưng thịt đậm đà hương vị truyền thống, sản phẩm sạch, không chất bảo quản, ăn cùng cơm nóng tuyệt ngon.', 160000.00, 150000.00, 130000.00, 180, 15, 4, 250, 25, 1, 4, 1),
    (9, 'Mật ong rừng U Minh', 'mat-ong-rung-u-minh', 'Mật ong nguyên chất khai thác từ rừng tràm U Minh, có màu vàng óng, hương thơm đặc trưng và vị ngọt thanh.', 800000.00, 750000.00, 650000.00, 100, 21, 5, 100, 10, 1, 4, 1),
    (10, 'Mè xửng Huế', 'me-xung-hue', 'Đặc sản Mè xửng Huế dẻo thơm, ngọt bùi, là sự hòa quyện của mạch nha, đậu phộng và mè rang.', 50000.00, 45000.00, 35000.00, 400, 27, 6, 500, 50, 1, 3, 1),
    (11, 'Mọc ốc', 'moc-oc', 'Mọc ốc được làm từ thịt ốc tươi xay nhuyễn, nấm mèo và giò sống, viên mọc dai ngon, đậm đà.', 130000.00, 120000.00, 100000.00, 110, 0, 0, 130, 15, 1, NULL, 1),
    (12, 'Rượu cần Tây Nguyên', 'ruou-can-tay-nguyen', 'Rượu cần là tinh hoa văn hóa của núi rừng Tây Nguyên, được ủ từ men lá cây và gạo nếp, hương vị độc đáo.', 200000.00, 180000.00, 150000.00, 70, 0, 0, 90, 10, 1, 4, 1),
    (13, 'Trà sen Tây Hồ', 'tra-sen-tay-ho', 'Trà sen Tây Hồ được ướp hương từ những bông sen Bách Diệp, mang đến hương thơm thanh khiết và tinh tế.', 450000.00, 420000.00, 380000.00, 130, 5, 1, 150, 15, 1, 4, 1),
    (14, 'Trứng kiến Tây Bắc', 'trung-kien-tay-bac', 'Đặc sản độc đáo của núi rừng Tây Bắc, trứng kiến non béo ngậy, thường dùng để nấu xôi hoặc làm gỏi.', 350000.00, 330000.00, 290000.00, 50, 0, 0, 60, 10, 1, NULL, 1),
    (15, 'Bề bề rang muối', 'be-be-rang-muoi', 'Bề bề tươi ngon được rang cùng muối và sả ớt, vỏ giòn, thịt ngọt đậm đà, là món nhậu hấp dẫn.', 280000.00, 260000.00, 220000.00, 140, 4, 1, 180, 20, 1, NULL, 2),
    (16, 'Cá bóp nấu me', 'ca-bop-nau-me', 'Lẩu cá bóp nấu me chua thanh, thịt cá bóp ngọt và chắc, là món ăn giải nhiệt và bổ dưỡng.', 320000.00, 290000.00, 250000.00, 110, 0, 0, 120, 10, 1, 4, 2),
    (17, 'Cá linh bông', 'ca-linh-bong', 'Cá linh mùa nước nổi, thân nhỏ, xương mềm, thịt ngọt, thường dùng để nấu lẩu hoặc kho lạt.', 180000.00, 165000.00, 140000.00, 200, 0, 0, 250, 25, 1, 3, 2),
    (18, 'Chả cá Móng', 'cha-ca-mong', 'Chả cá Móng Cái nổi tiếng với độ dai, giòn và hương vị đậm đà từ thịt cá tươi nguyên chất.', 240000.00, 220000.00, 190000.00, 160, 0, 0, 200, 20, 1, NULL, 2),
    (19, 'Chả cá mực tôm', 'cha-ca-muc-tom', 'Sự kết hợp hoàn hảo giữa cá, mực và tôm tươi, tạo nên món chả dai ngon, đậm vị biển.', 260000.00, 245000.00, 210000.00, 130, 0, 0, 150, 15, 1, NULL, 2),
    (20, 'Chả mỡ ghẹ', 'cha-mo-ghe', 'Chả mỡ ghẹ béo ngậy, thơm lừng mùi ghẹ tươi, là món ăn độc đáo và đầy dinh dưỡng từ hải sản.', 300000.00, 280000.00, 240000.00, 100, 0, 0, 110, 10, 1, 4, 2),
    (21, 'Chả mực Hạ Long', 'cha-muc-ha-long', 'Đặc sản trứ danh Hạ Long, chả mực được giã tay dai giòn, thơm nức hương mực mai tươi.', 480000.00, 450000.00, 390000.00, 220, 5, 1, 250, 25, 1, 4, 2),
    (22, 'Chả tôm', 'cha-tom', 'Chả tôm được làm từ tôm tươi xay nhuyễn, có độ dai và vị ngọt tự nhiên, thích hợp chiên hoặc nấu canh.', 230000.00, 210000.00, 180000.00, 170, 0, 0, 220, 20, 1, NULL, 2),
    (23, 'Cua Cà Mau', 'cua-ca-mau', 'Cua Cà Mau nổi tiếng chắc thịt, ngọt và nhiều gạch. Sản phẩm được giao sống tận nơi.', 600000.00, 580000.00, 500000.00, 120, 5, 1, 100, 10, 1, 4, 2),
    (24, 'Gỏi cá trích', 'goi-ca-trich', 'Gỏi cá trích Phú Quốc với cá tươi, dừa nạo và rau thơm, cuốn bánh tráng chấm nước mắm chua ngọt.', 190000.00, 175000.00, 150000.00, 150, 0, 0, 160, 15, 1, 4, 2),
    (25, 'Hàu nướng mỡ hành', 'hau-nuong-mo-hanh', 'Hàu sữa tươi sống được nướng trên bếp than cùng mỡ hành thơm lừng, đậu phộng béo bùi.', 150000.00, 140000.00, 110000.00, 250, 0, 0, 300, 30, 1, NULL, 2),
    (26, 'Mực một nắng', 'muc-mot-nang', 'Mực lá được phơi qua đúng một nắng, giữ được độ dẻo, ngọt và hương thơm đặc trưng của biển.', 700000.00, 650000.00, 580000.00, 180, 0, 0, 200, 20, 1, 4, 2),
    (27, 'Nem hải sản', 'nem-hai-san', 'Nem hải sản với vỏ ngoài giòn tan, bên trong là nhân tôm, cua, ghẹ hòa quyện cùng sốt mayonnaise béo ngậy.', 140000.00, 125000.00, 100000.00, 280, 5, 1, 350, 35, 1, NULL, 2),
    (28, 'Sá sùng nướng', 'sa-sung-nuong', 'Sá sùng khô, đặc sản quý hiếm của vùng biển Quan Lạn, nướng lên có vị ngọt đậm, dai và thơm.', 900000.00, 880000.00, 780000.00, 70, 0, 0, 80, 10, 1, NULL, 2),
    (29, 'Tôm sú Bạc Liêu', 'tom-su-bac-lieu', 'Tôm sú Bạc Liêu được nuôi trồng theo mô hình sinh thái, thịt chắc, ngọt và an toàn cho sức khỏe.', 450000.00, 430000.00, 380000.00, 190, 0, 0, 200, 20, 1, 4, 2),
    (30, 'Ruốc bề bề', 'ruoc-be-be', 'Ruốc làm từ 100% thịt bề bề tươi, sợi ruốc bông, tơi, vị ngọt đậm đà, giàu canxi.', 180000.00, 170000.00, 145000.00, 130, 0, 0, 150, 15, 1, NULL, 3),
    (31, 'Ruốc cá basa', 'ruoc-ca-basa', 'Ruốc cá basa thơm ngon, không tanh, giàu Omega-3, thích hợp cho cả trẻ em và người lớn.', 120000.00, 110000.00, 90000.00, 200, 0, 0, 250, 25, 1, NULL, 3),
    (32, 'Ruốc cá lóc', 'ruoc-ca-loc', 'Ruốc cá lóc đồng nguyên chất, sợi vàng ươm, thơm ngon, bổ dưỡng, tốt cho người ốm và trẻ nhỏ.', 160000.00, 150000.00, 130000.00, 180, 0, 0, 200, 20, 1, 3, 3),
    (33, 'Ruốc cá rô đồng', 'ruoc-ca-ro-dong', 'Ruốc làm từ cá rô đồng tự nhiên, thịt dai, thơm, được sao khô thủ công, giữ trọn vị ngọt của cá.', 170000.00, 155000.00, 135000.00, 150, 0, 0, 180, 15, 1, NULL, 3),
    (34, 'Ruốc cá thu', 'ruoc-ca-thu', 'Ruốc cá thu giàu dinh dưỡng, thịt cá thơm, sợi ruốc bông, là lựa chọn tuyệt vời cho bữa ăn gia đình.', 250000.00, 235000.00, 200000.00, 210, 0, 0, 250, 25, 1, 4, 3),
    (35, 'Ruốc mắm Huế', 'ruoc-mam-hue', 'Đặc sản mắm ruốc Huế thơm nồng đặc trưng, dùng để nêm nếm các món bún bò, lẩu hoặc xào nấu.', 80000.00, 70000.00, 55000.00, 300, 0, 0, 400, 40, 1, 3, 3),
    (36, 'Ruốc tép Đồng Tháp', 'ruoc-tep-dong-thap', 'Ruốc làm từ tép đồng tươi, có màu đỏ tự nhiên, vị ngọt đậm, thơm mùi tép, ăn kèm cơm trắng hoặc cháo.', 140000.00, 130000.00, 110000.00, 220, 0, 0, 300, 30, 1, NULL, 3),
    (37, 'Ruốc thịt lợn Nam Định', 'ruoc-thit-lon-nam-dinh', 'Ruốc thịt lợn làm theo công thức gia truyền Nam Định, sợi ruốc bông, tơi, vàng óng và thơm ngon.', 320000.00, 290000.00, 250000.00, 350, 5, 1, 400, 40, 1, 4, 3),
    (38, 'Ruốc tôm Bình Định', 'ruoc-tom-binh-dinh', 'Ruốc tôm Bình Định được làm từ tôm đất tươi, giã tay, có vị ngọt thanh, thơm mùi tôm và màu sắc hấp dẫn.', 280000.00, 260000.00, 220000.00, 240, 0, 0, 300, 30, 1, NULL, 3),
    (39, 'Ruốc tôm đất Cà Mau', 'ruoc-tom-dat-ca-mau', 'Ruốc làm từ tôm đất Cà Mau 100%, không pha trộn, sợi ruốc dai, ngọt và đậm đà hương vị miền sông nước.', 300000.00, 285000.00, 245000.00, 190, 0, 0, 220, 20, 1, 4, 3),
    (40, 'Ruốc tôm Hạ Long', 'ruoc-tom-ha-long', 'Ruốc tôm Hạ Long nổi tiếng với sợi ruốc bông, tơi, vị ngọt đậm của tôm he, món quà ý nghĩa từ biển.', 290000.00, 270000.00, 230000.00, 230, 0, 0, 280, 25, 1, 4, 3),
    (41, 'Ruốc tôm rong biển', 'ruoc-tom-rong-bien', 'Sự kết hợp độc đáo giữa ruốc tôm và rong biển, mang lại hương vị mới lạ và bổ sung nhiều khoáng chất.', 200000.00, 185000.00, 160000.00, 160, 0, 0, 200, 20, 1, NULL, 3),
    (42, 'Da Gà Chiên Giòn', 'da-ga-chien-gion', 'Da gà được làm sạch, tẩm ướp gia vị đậm đà rồi chiên giòn rụm, là món ăn vặt hấp dẫn khó cưỡng.', 75000.00, 69000.00, 55000.00, 180, 0, 0, 200, 20, 1, NULL, 4),
    (43, 'Gà Cháy Tỏi', 'ga-chay-toi', 'Thịt gà mềm ngọt hòa quyện với hương thơm nồng nàn của tỏi phi vàng, tạo nên món ăn đưa cơm hấp dẫn.', 180000.00, 169000.00, 145000.00, 150, 0, 0, 150, 15, 1, 3, 4),
    (44, 'Gà Đông Tảo Ủ Muối', 'ga-dong-tao-u-muoi', 'Đặc sản gà Đông Tảo trứ danh với lớp da giòn, thịt ngọt và chắc, được ủ muối hoa tiêu thơm lừng.', 450000.00, 429000.00, 380000.00, 90, 0, 0, 100, 10, 1, 4, 4),
    (45, 'Gà Nướng Muối Ớt', 'ga-nuong-muoi-ot', 'Gà ta được tẩm ướp muối ớt cay nồng, nướng trên than hồng cho lớp da vàng giòn, thịt mềm và mọng nước.', 250000.00, 235000.00, 200000.00, 210, 0, 0, 200, 20, 1, 4, 4),
    (46, 'Gà Nướng Thảo Mộc', 'ga-nuong-thao-moc', 'Hương vị độc đáo từ các loại thảo mộc núi rừng thấm đượm trong từng thớ thịt gà nướng mềm thơm.', 260000.00, 245000.00, 210000.00, 130, 0, 0, 150, 15, 1, NULL, 4),
    (47, 'Gà Ủ Muối', 'ga-u-muoi', 'Gà ta nguyên con được ủ muối thảo dược, da vàng óng, thịt dai ngọt và giữ trọn hương vị tự nhiên.', 220000.00, 209000.00, 180000.00, 300, 3, 1, 250, 25, 1, 3, 4),
    (48, 'Gà Ủ Xì Dầu', 'ga-u-xi-dau', 'Món gà ủ xì dầu với công thức đặc biệt, thịt gà mềm thấm vị, đậm đà, hương thơm quyến rũ.', 230000.00, 219000.00, 190000.00, 180, 0, 0, 180, 20, 1, NULL, 4),
    (49, 'Gà Viên Chiên', 'ga-vien-chien', 'Gà viên chiên vàng giòn bên ngoài, mềm ngọt bên trong, là món ăn vặt yêu thích của mọi lứa tuổi.', 90000.00, 85000.00, 70000.00, 250, 0, 0, 300, 30, 1, NULL, 4),
    (50, 'Há Cảo Gà', 'ha-cao-ga', 'Lớp vỏ bánh mềm dai bọc lấy nhân thịt gà và rau củ tươi ngon, hấp lên thơm phức, chấm cùng nước tương đậm đà.', 110000.00, 99000.00, 80000.00, 160, 0, 0, 200, 20, 1, NULL, 4),
    (51, 'Gà Kho Mắm', 'ga-kho-mam', 'Hương vị dân dã mà đậm đà khó quên của món gà kho mắm, thịt gà săn chắc thấm đượm vị mắm thơm nồng.', 150000.00, 139000.00, 115000.00, 190, 0, 0, 220, 20, 1, 3, 4),
    (52, 'Bánh Hạt Điều', 'banh-hat-dieu', 'Bánh quy bơ giòn tan kết hợp với những hạt điều bùi béo, tạo nên món ăn vặt thơm ngon, dinh dưỡng.', 130000.00, 120000.00, 95000.00, 140, 0, 0, 180, 15, 1, NULL, 5),
    (53, 'Bánh Thanh Hạnh Nhân', 'banh-thanh-hanh-nhan', 'Những thanh bánh giòn rụm phủ đầy lát hạnh nhân rang vàng, vị ngọt nhẹ, béo bùi tự nhiên.', 150000.00, 139000.00, 110000.00, 200, 0, 0, 250, 25, 1, 3, 5),
    (54, 'Bánh Thuyền Macca', 'banh-thuyen-macca', 'Đế bánh giòn tan hình chiếc thuyền, bên trên là sự kết hợp của macca, hạt điều, hạnh nhân và bí xanh.', 160000.00, 149000.00, 120000.00, 170, 0, 0, 200, 20, 1, NULL, 5),
    (55, 'Hạnh Nhân Rang Bơ', 'hanh-nhan-rang-bo', 'Hạnh nhân nhập khẩu được rang cùng bơ và muối, giòn rụm, thơm lừng, là món ăn vặt tốt cho sức khỏe.', 280000.00, 265000.00, 220000.00, 220, 0, 0, 250, 25, 1, NULL, 5),
    (56, 'Hạt Điều Rang Muối', 'hat-dieu-rang-muoi', 'Hạt điều Bình Phước loại A, hạt to đều, được rang muối thủ công, giữ vị ngọt bùi tự nhiên.', 320000.00, 299000.00, 250000.00, 400, 5, 1, 350, 35, 1, 4, 5),
    (57, 'Hạt Macca Sấy Nứt Vỏ', 'hat-macca-say-nut-vo', 'Nữ hoàng của các loại hạt, hạt macca sấy khô tự nhiên, nứt vỏ dễ dàng, vị béo ngậy, thơm ngon.', 350000.00, 330000.00, 280000.00, 250, 4, 1, 300, 30, 1, 4, 5),
    (58, 'Hạt Óc Chó', 'hat-oc-cho', 'Hạt óc chó chứa nhiều Omega-3, tốt cho trí não và tim mạch, vị bùi, béo nhẹ, dễ ăn.', 300000.00, 285000.00, 240000.00, 210, 0, 0, 220, 20, 1, NULL, 5),
    (59, 'Hạt Sen Sấy Giòn', 'hat-sen-say-gion', 'Hạt sen được sấy giòn bằng công nghệ hiện đại, giữ nguyên giá trị dinh dưỡng, vị bùi, ngọt thanh.', 180000.00, 169000.00, 140000.00, 190, 0, 0, 250, 25, 1, 3, 5),
    (60, 'Mix 5 Loại Hạt Dinh Dưỡng', 'mix-5-loai-hat-dinh-duong', 'Hỗn hợp 5 loại hạt cao cấp: óc chó, macca, hạnh nhân, hạt điều, bí xanh. Cung cấp năng lượng và dưỡng chất.', 340000.00, 325000.00, 280000.00, 280, 0, 0, 300, 30, 1, NULL, 5),
    (61, 'Thanh Rong Biển Kẹp Hạt', 'thanh-rong-bien-kep-hat', 'Rong biển sấy giòn kẹp các loại hạt dinh dưỡng, là món ăn vặt lạ miệng, thơm ngon và tốt cho sức khỏe.', 120000.00, 110000.00, 90000.00, 240, 0, 0, 300, 30, 1, NULL, 5),
    (62, 'Chả Chân Vịt', 'cha-chan-vit', 'Món chả độc đáo làm từ chân vịt rút xương, giòn sần sật, đậm đà gia vị, thích hợp làm món nhậu hoặc ăn chơi.', 140000.00, 129000.00, 110000.00, 130, 0, 0, 150, 15, 1, NULL, 6),
    (63, 'Chả Vịt Thúy Hạnh', 'cha-vit-thuy-hanh', 'Đặc sản chả vịt Thúy Hạnh nổi tiếng với hương vị thơm ngon đặc trưng, thịt vịt mềm ngọt quyện mỡ hành béo ngậy.', 190000.00, 179000.00, 155000.00, 110, 0, 0, 130, 10, 1, 4, 6),
    (64, 'Chân Vịt Rút Xương Ủ Muối', 'chan-vit-rut-xuong-u-muoi', 'Chân vịt rút xương tiện lợi, được ủ muối thảo mộc, giòn sần sật, chấm cùng sốt chấm cay cay là hết ý.', 150000.00, 135000.00, 115000.00, 200, 0, 0, 250, 25, 1, NULL, 6),
    (65, 'Chân Vịt Rút Xương Ủ Xì Dầu', 'chan-vit-rut-xuong-u-xi-dau', 'Chân vịt rút xương ngâm trong nước sốt xì dầu thảo mộc đậm đà, vị mặn ngọt hài hòa, thơm nức.', 155000.00, 140000.00, 120000.00, 180, 0, 0, 220, 20, 1, NULL, 6),
    (66, 'Mọc Vịt', 'moc-vit', 'Viên mọc làm từ thịt vịt xay nhuyễn, nấm hương và gia vị, dai ngon, ngọt thanh, dùng để nấu canh hoặc thả lẩu.', 130000.00, 119000.00, 99000.00, 150, 0, 0, 180, 15, 1, NULL, 6),
    (67, 'Pate Gan Vịt', 'pate-gan-vit', 'Pate gan vịt kiểu Pháp béo ngậy, mềm mịn, thơm lừng hương vị của rượu cognac và các loại gia vị hảo hạng.', 250000.00, 230000.00, 190000.00, 100, 4, 1, 120, 10, 1, 4, 6),
    (68, 'Vịt Quay', 'vit-quay', 'Vịt quay da giòn rụm màu cánh gián, thịt mềm ngọt, được tẩm ướp công phu theo công thức gia truyền.', 350000.00, 329000.00, 280000.00, 160, 4, 1, 150, 15, 1, 3, 6),
    (69, 'Vịt Tiềm Hạt Sen', 'vit-tiem-hat-sen', 'Món ăn bổ dưỡng với thịt vịt mềm rục, hạt sen bùi thơm và nước dùng ngọt thanh từ các vị thuốc bắc.', 280000.00, 265000.00, 225000.00, 120, 0, 0, 130, 10, 1, NULL, 6),
    (70, 'Vịt Ủ Xì Dầu', 'vit-u-xi-dau', 'Thịt vịt mềm ngọt thấm đẫm trong nước sốt xì dầu và hoa hồi, quế, thảo quả, hương vị khó quên.', 270000.00, 255000.00, 220000.00, 140, 0, 0, 160, 15, 1, NULL, 6),
    (71, 'Chả Cá Thác Lác Tươi', 'cha-ca-thac-lac-tuoi', 'Chả cá thác lác nguyên chất, được quết tay dai ngon, không hàn the, ngọt vị cá tự nhiên.', 200000.00, 185000.00, 155000.00, 250, 0, 0, 300, 30, 1, 4, 7),
    (72, 'Cá Chiên Tẩm Gia Vị Sấy Khô', 'ca-chien-tam-gia-vi-say-kho', 'Cá nục được chiên giòn rồi rim với gia vị mặn ngọt, sau đó sấy khô, món ăn vặt hoặc ăn với cơm đều ngon.', 150000.00, 139000.00, 110000.00, 180, 0, 0, 200, 20, 1, NULL, 7),
    (73, 'Cá Chua Ngọt Đông Hũ', 'ca-chua-ngot-dong-hu', 'Cá được kho rim chua ngọt đậm đà, đóng trong hũ tiện lợi, chỉ cần hâm nóng là có thể dùng ngay.', 130000.00, 119000.00, 95000.00, 150, 0, 0, 180, 15, 1, 3, 7),
    (74, 'Cá Hộp', 'ca-hop', 'Cá nục hoặc cá trích sốt cà chua, sản phẩm tiện lợi, giàu dinh dưỡng cho bữa ăn nhanh.', 40000.00, 35000.00, 25000.00, 500, 0, 0, 600, 60, 1, NULL, 7),
    (75, 'Cá Khô', 'ca-kho', 'Cá lóc hoặc cá sặc khô, được phơi nắng tự nhiên, thịt dai ngọt, dùng để nướng, chiên hoặc làm gỏi.', 250000.00, 230000.00, 190000.00, 200, 0, 0, 250, 25, 1, 3, 7),
    (76, 'Cá Lóc Rim Me', 'ca-loc-rim-me', 'Thịt cá lóc đồng chiên vàng, rim cùng nước sốt me chua ngọt đậm đà, món ăn hao cơm trứ danh.', 160000.00, 149000.00, 125000.00, 170, 0, 0, 200, 20, 1, NULL, 7),
    (77, 'Cá Một Nắng', 'ca-mot-nang', 'Cá dứa hoặc cá đù một nắng, thịt dẻo, vị ngọt tự nhiên, không quá khô, chiên lên thơm lừng.', 300000.00, 280000.00, 240000.00, 220, 0, 0, 250, 25, 1, 4, 7),
    (78, 'Cá Mực Một Nắng Tẩm Gia Vị', 'ca-muc-mot-nang-tam-gia-vi', 'Mực một nắng dẻo ngọt, được tẩm ướp gia vị cay cay mặn mặn, nướng lên thơm nức mũi.', 380000.00, 359000.00, 300000.00, 190, 0, 0, 200, 20, 1, NULL, 7),
    (79, 'Cá Rim', 'ca-rim', 'Cá cơm hoặc cá bống rim mặn ngọt, món ăn dân dã nhưng đậm đà hương vị quê hương.', 120000.00, 110000.00, 90000.00, 280, 0, 0, 300, 30, 1, NULL, 7),
    (80, 'Cá Rô Phi Sấy Giòn', 'ca-ro-phi-say-gion', 'Thịt cá rô phi được phi lê, tẩm ướp và sấy giòn tan, có thể ăn liền như snack.', 140000.00, 129000.00, 105000.00, 160, 0, 0, 200, 20, 1, NULL, 7),
    (81, 'Cá Thu Rim Tỏi Ớt', 'ca-thu-rim-toi-ot', 'Khúc cá thu tươi được chiên vàng, rim trong nước sốt tỏi ớt mặn ngọt, đậm đà, thơm lừng.', 280000.00, 265000.00, 220000.00, 190, 0, 0, 220, 20, 1, 4, 7),
    (82, 'Chả Cá Thác Lác Hậu Giang', 'cha-ca-thac-lac-hau-giang', 'Đặc sản Hậu Giang, chả cá thác lác dai ngon, thơm mùi thì là, chiên vàng hoặc nấu lẩu đều tuyệt.', 210000.00, 195000.00, 165000.00, 210, 5, 1, 250, 25, 1, 4, 7),
    (83, 'Chả Cá Thác Lác Tẩm Gia Vị', 'cha-ca-thac-lac-tam-gia-vi', 'Chả cá thác lác đã được quết dai và tẩm ướp gia vị vừa ăn, tiện lợi cho việc chế biến.', 220000.00, 205000.00, 175000.00, 180, 0, 0, 200, 20, 1, NULL, 7),
    (84, 'Pate Cá Hồi Hạ Long', 'pate-ca-hoi-ha-long', 'Pate làm từ cá hồi tươi vùng biển Hạ Long, béo ngậy, thơm ngon, giàu Omega-3, dùng kèm bánh mì.', 190000.00, 175000.00, 150000.00, 140, 0, 0, 160, 15, 1, 3, 7),
    (85, 'Chả Giò Chả Lụa', 'cha-gio-cha-lua', 'Combo chả giò và chả lụa truyền thống, được làm từ thịt heo tươi ngon theo công thức gia truyền, thơm ngon, đậm đà.', 180000.00, 169000.00, 140000.00, 250, 0, 0, 300, 30, 1, 4, 8),
    (86, 'Chân Giò Giả Cầy', 'chan-gio-gia-cay', 'Chân giò heo được thui vàng, nấu cùng riềng, mẻ, mắm tôm, tạo nên hương vị giả cầy đặc trưng, thơm nức mũi.', 220000.00, 205000.00, 175000.00, 180, 0, 0, 200, 20, 1, 3, 8),
    (87, 'Đặc Sản Chả Chìa Hải Phòng', 'dac-san-cha-chia-hai-phong', 'Chả chìa (chả sả) Hải Phòng, thịt heo băm nhuyễn bọc quanh cây sả, nướng thơm lừng, hương vị khó quên.', 190000.00, 179000.00, 150000.00, 160, 0, 0, 180, 15, 1, 4, 8),
    (88, 'Đặc Sản Chả Cốm Hà Nội', 'dac-san-cha-com-ha-noi', 'Thức quà của mùa thu Hà Nội, chả cốm dẻo thơm, sự hòa quyện giữa thịt heo xay và những hạt cốm non xanh mướt.', 210000.00, 199000.00, 170000.00, 300, 4, 1, 250, 25, 1, 4, 8),
    (89, 'Đặc Sản Chả Sụn', 'dac-san-cha-sun', 'Chả sụn giòn sần sật, được làm từ thịt heo và sụn non, chiên vàng hay nướng đều thơm ngon khó cưỡng.', 200000.00, 185000.00, 155000.00, 220, 0, 0, 250, 25, 1, NULL, 8),
    (90, 'Khâu Nhục Lạng Sơn', 'khau-nhuc-lang-son', 'Món ăn đặc sản Lạng Sơn, thịt ba chỉ được tẩm ướp công phu, hầm mềm tan, béo ngậy mà không ngán.', 250000.00, 235000.00, 200000.00, 150, 0, 0, 150, 15, 1, 3, 8),
    (91, 'Mắm Nêm Tai Heo', 'mam-nem-tai-heo', 'Tai heo giòn sần sật ngâm trong mắm nêm đậm đà, thêm chút dứa và gia vị, món nhậu hay ăn kèm bún đều tuyệt.', 140000.00, 129000.00, 105000.00, 130, 0, 0, 160, 15, 1, NULL, 8),
    (92, 'Nem Chua Thanh Hóa', 'nem-chua-thanh-hoa', 'Đặc sản nem chua Thanh Hóa, vị chua thanh, cay nồng của tỏi ớt, thơm mùi lá chuối, món quà quê ý nghĩa.', 90000.00, 80000.00, 65000.00, 400, 5, 1, 500, 50, 1, 4, 8),
    (93, 'Nem Rán Hà Nội', 'nem-ran-ha-noi', 'Nem rán (chả giò) theo phong vị Hà Nội, vỏ giòn rụm, nhân đầy đặn thịt, mộc nhĩ, miến, chấm nước mắm chua ngọt.', 120000.00, 110000.00, 85000.00, 350, 0, 0, 400, 40, 1, NULL, 8),
    (94, 'Nem Lụi Nha Trang', 'nem-lui-nha-trang', 'Nem nướng làm từ thịt heo xay, được lụi trên que sả hoặc que tre, nướng than hồng thơm lừng, ăn kèm rau sống và bánh tráng.', 160000.00, 149000.00, 120000.00, 280, 0, 0, 300, 30, 1, 3, 8),
    (95, 'Pate Gan Heo', 'pate-gan-heo', 'Pate gan heo nhà làm, mềm mịn, béo ngậy, thơm mùi tiêu, không chất bảo quản, hoàn hảo cho bữa sáng.', 150000.00, 135000.00, 110000.00, 210, 0, 0, 250, 25, 1, NULL, 8),
    (96, 'Tai Heo Cuộn Lưỡi', 'tai-heo-cuon-luoi', 'Món nhậu hấp dẫn với tai heo giòn và lưỡi heo mềm được cuộn chặt, luộc chín, thái mỏng chấm mắm gừng.', 180000.00, 165000.00, 140000.00, 170, 0, 0, 200, 20, 1, NULL, 8),
    (97, 'Tai Heo Ủ Muối', 'tai-heo-u-muoi', 'Tai heo được làm sạch, ủ muối hoa tiêu, giòn sần sật, thơm mùi gia vị, là món khai vị tuyệt vời.', 170000.00, 159000.00, 135000.00, 190, 0, 0, 220, 20, 1, 3, 8),
    (98, 'Tai Heo Ủ Xì Dầu', 'tai-heo-u-xi-dau', 'Tai heo ngâm trong nước sốt xì dầu thảo mộc đậm đà, vị mặn ngọt hài hòa, thơm nức mùi hoa hồi, quế.', 175000.00, 162000.00, 140000.00, 160, 0, 0, 180, 15, 1, NULL, 8),
    (99, 'Thịt Chưng Mắm Tép', 'thit-chung-mam-tep', 'Món ăn hao cơm trứ danh, thịt vai heo xay chưng cùng mắm tép, riềng, hành khô cho đến khi keo lại, thơm lừng.', 190000.00, 175000.00, 150000.00, 240, 0, 0, 260, 25, 1, 4, 8),
    (100, 'Thịt Heo Sấy Khô', 'thit-heo-say-kho', 'Thịt heo sấy khô kiểu gác bếp, được tẩm ướp gia vị đậm đà, dai ngọt, cay cay, là món nhậu lai rai hấp dẫn.', 350000.00, 329000.00, 280000.00, 200, 4, 1, 220, 20, 1, 3, 8),
    (101, 'Thịt Heo Xông Khói', 'thit-heo-xong-khoi', 'Thịt ba chỉ heo được ướp gia vị và xông khói bằng gỗ sồi, mang lại hương vị thơm ngon đặc trưng.', 400000.00, 379000.00, 320000.00, 180, 0, 0, 200, 20, 1, NULL, 8),
    (102, 'Xúc Xích Cốm', 'xuc-xich-com', 'Sự kết hợp độc đáo giữa xúc xích heo và cốm xanh, khi chiên lên vỏ ngoài giòn, bên trong dẻo thơm.', 130000.00, 119000.00, 95000.00, 260, 0, 0, 300, 30, 1, NULL, 8),
    (103, 'Chả Ngan', 'cha-ngan', 'Chả ngan được làm từ thịt ngan tươi, xay nhuyễn và tẩm ướp gia vị, chiên vàng thơm nức, vị ngọt đậm đà.', 240000.00, 225000.00, 190000.00, 150, 0, 0, 170, 15, 1, 4, 9),
    (104, 'Ngan Một Nắng', 'ngan-mot-nang', 'Thịt ngan được tẩm ướp gia vị rồi phơi qua một nắng, thịt dẻo, đậm vị, chiên hoặc nướng đều rất ngon.', 280000.00, 260000.00, 220000.00, 120, 0, 0, 140, 10, 1, NULL, 9),
    (105, 'Ngan Xông Khói', 'ngan-xong-khoi', 'Thịt ức ngan được tẩm ướp và xông khói theo quy trình nghiêm ngặt, thái lát mỏng ăn liền, hương vị hảo hạng.', 320000.00, 299000.00, 260000.00, 140, 0, 0, 150, 15, 1, 3, 9);

-- Dữ liệu mẫu cho Coupons
INSERT INTO Coupons 
(code, description, type, value, max_value, min_order_value, quantity, used_count, start_date, end_date, status)
VALUES
('MTAY10', 'Áp dụng cho các sản phẩm đặc sản miền Tây như bánh pía, mật ong U Minh.', 1, 10, NULL, 100000, 100, 0, '2025-10-01', '2026-02-28', 1),

('MBIEN20K', 'Áp dụng cho các sản phẩm hải sản vùng biển như chả mực, tôm sú.', 1, 20000, NULL, 150000, 80, 0, '2025-10-01', '2026-02-28', 1),

('MTRUNGSHIP', 'Áp dụng cho các đơn hàng đặc sản miền Trung như ruốc Huế, ruốc cá.', 0, 100, NULL, 100000, 150, 0, '2025-10-05', '2026-02-28', 1),

('MBAC15', 'Giảm giá các sản phẩm miền Bắc như gà Đông Tảo, gà cháy tỏi.', 1, 15, NULL, 120000, 100, 0, '2025-10-10', '2026-02-28', 1),

('DINHDUONG50K', 'Giảm 50,000đ cho các loại hạt dinh dưỡng cao cấp.', 1, 50000, NULL, 200000, 200, 0, '2025-10-01', '2026-02-28', 1),

('VITSHIP', 'Áp dụng miễn phí vận chuyển cho các món đặc sản từ vịt như chả vịt, pate gan vịt.', 0, 100, NULL, 80000, 120, 0, '2025-10-01', '2026-02-28', 1);

-- Dữ liệu mẫu cho CouponProducts
INSERT INTO CouponProducts (coupon_id, product_id) VALUES
-- Giảm 10% toàn shop
(1, NULL),

-- Giảm 20k toàn shop
(2, NULL),

-- Miễn phí ship toàn shop
(3, NULL),

-- Giảm 15% toàn shop
(4, NULL),

-- Giảm 50k toàn shop
(5, NULL),

-- Miễn phí ship toàn shop
(6, NULL);

-- Dữ liệu mẫu cho CartItems
INSERT INTO CartItems (qty_total, price_total, user_id, product_id) VALUES
(1, 45000, 1, 1),
(2, 56000, 1, 2),
(1, 28000, 2, 3),
(3, 330000, 3, 4),
(5, 375000, 4, 6),
(2, 170000, 4, 7),
(10, 1100000, 5, 8),
(3, 690000, 5, 9),
(2, 130000, 2, 10);

-- Dữ liệu mẫu cho Discounts
INSERT INTO Discounts (name, description, value, start_date, end_date, status) VALUES
('Giảm 10% mùa hè', 'Áp dụng cho tất cả đặc sản mùa hè', 10, '2025-06-01 00:00:00', '2025-08-31 23:59:59', 1),
('Flash Sale 50k', 'Giảm trực tiếp 50.000 VND cho đơn hàng đặc sản', 50000, '2025-09-20 00:00:00', '2025-09-25 23:59:59', 1),
('Mua 1 tặng 1', 'Chương trình mua 1 tặng 1 cho một số đặc sản chọn lọc', 100, '2025-10-01 00:00:00', '2025-10-10 23:59:59', 0),
('Giảm 20% dịp lễ', 'Khuyến mại 20% tất cả đặc sản dịp lễ', 20, '2025-12-20 00:00:00', '2025-12-31 23:59:59', 1),
('Free Ship 0đ', 'Miễn phí vận chuyển cho đơn hàng đặc sản', 0, '2025-09-01 00:00:00', '2025-09-30 23:59:59', 1);

-- Dữ liệu mẫu cho DiscountProducts
INSERT INTO DiscountProducts (discount_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(5, 10);

-- Dữ liệu mẫu cho Sliders
INSERT INTO Sliders (name, description, image_url, link_url, sort_order, status, start_date, end_date) VALUES
('Khuyến mãi mùa hè', 'Giảm giá sốc lên đến 50% cho toàn bộ sản phẩm mùa hè', 'https://bepsachviet.com/wp-content/uploads/2025/09/Banner-combo-vit-1400x526.jpg', 'http://localhost:5173/category/san-pham-tu-vit', 1, 1, '2026-01-06 07:00:00', '2026-01-22 07:00:00'),
('Đặc sản bán chạy', 'Top sản phẩm được yêu thích nhất trong tháng', 'https://bepsachviet.com/wp-content/uploads/2025/09/123-456-7890-1-1400x526.png', 'http://localhost:5173/product/ruoc-tom-binh-dinh', 2, 1, NULL, NULL),
('Mới ra mắt', 'Khám phá bộ sưu tập sản phẩm mới nhất', 'https://bepsachviet.com/wp-content/uploads/2025/02/3.png', 'http://localhost:5173/product/nem-lui-nha-trang', 3, 1, NULL, NULL),
('Ưu đãi cuối tuần', 'Giảm giá đặc biệt chỉ trong cuối tuần này', 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767891002/BSV/gnjenqdygujop5fjx6rr.jpg', 'http://localhost:5173/product/cha-ca-thac-lac-hau-giang', 4, 0, '2026-01-08 07:00:00', '2026-01-22 07:00:00'),
('Sản phẩm nổi bật', 'Những sản phẩm được đánh giá cao và đáng mua nhất', 'https://bepsachviet.com/wp-content/uploads/2023/09/Maroon-and-Yellow-Modern-Food-Promotion-Banner-Landscape-1.png', 'http://localhost:5173/product/ga-u-muoi', 5, 0, NULL, NULL);

-- Dữ liệu mẫu cho ProductImages
INSERT INTO ProductImages (is_main, image_url, product_id, alt_text) VALUES
    -- Sản phẩm ID 1
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767112956/BSV/lolo50xfh3uklxxyxbfn.jpg', 1, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767112958/BSV/c506w64gkuog7yx80eoy.jpg', 1, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767112958/BSV/gwginzbzxcssrdvlxoof.jpg', 1, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767112959/BSV/dk6ousbn4sp5xrbe1hex.jpg', 1, NULL),
    
    -- Sản phẩm ID 2
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861683/BSV/qfu6jmmlbvn9hogyw27x.jpg', 2, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861683/BSV/yaeexibaa2oibfglw5br.jpg', 2, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861684/BSV/e6wy3tsspwm5v9qs1ymy.jpg', 2, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861685/BSV/mryayll4fe4gjqvaqa7e.jpg', 2, NULL),
    
    -- Sản phẩm ID 3
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113021/BSV/illcoed3owvaqm8v4iz6.jpg', 3, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113021/BSV/pptwymannygd4pbuuxne.jpg', 3, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113022/BSV/oyeit6yikzrxiqcconne.jpg', 3, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113023/BSV/jenpjudjagq7tdombg3u.jpg', 3, NULL),
    
    -- Sản phẩm ID 4
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111107/BSV/fr8tv44ssuhl08yzazl5.jpg', 4, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111109/BSV/dnc6swstyun0ilsj2yyj.png', 4, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111110/BSV/jsxiylzxneskfg9acxai.jpg', 4, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111111/BSV/whiu0d3azgl1w1pxnmoc.jpg', 4, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111111/BSV/b3iegdo7nxuviouqqgwt.jpg', 4, NULL),
    
    -- Sản phẩm ID 5
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861757/BSV/p3boiw2uc7h9x5ir6ltf.jpg', 5, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861758/BSV/fr0y65bfi8nm6i39w20l.jpg', 5, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861759/BSV/raxcoiehx7qkmwwphmaz.jpg', 5, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861759/BSV/kiidjkn4a9qriq1ysjci.jpg', 5, NULL),
    
    -- Sản phẩm ID 6
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113079/BSV/uia1tyc1rdcto2hnqhae.jpg', 6, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113080/BSV/llkppnshdwbv2a34xqln.png', 6, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113081/BSV/jo4gymrviwawbicwbkaa.jpg', 6, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113082/BSV/a8fb2artzack7mj23msi.jpg', 6, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113084/BSV/um6mg11w4fhxwcl4rkfd.jpg', 6, NULL),
    
    -- Sản phẩm ID 7
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859816/BSV/nxjuaz64f9riku8byzum.jpg', 7, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859817/BSV/avq9y9rajtr05k1nv6fb.jpg', 7, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859817/BSV/urehiasuew16korxdd02.jpg', 7, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859818/BSV/k9tfiii3wcgywstwvbh9.jpg', 7, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859819/BSV/jhlmc3qeickgcr2upr7x.jpg', 7, NULL),
    
    -- Sản phẩm ID 8
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861605/BSV/blfzcb4mngt6jbkewozq.jpg', 8, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861606/BSV/sc4ku9nw285pshjkbcms.jpg', 8, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861607/BSV/nqyjjypxxhsmg2sakdji.jpg', 8, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861608/BSV/f513zsg9beyvnws15zow.jpg', 8, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861609/BSV/sz53vldqtqykhx5gwnfg.jpg', 8, NULL),
    
    -- Sản phẩm ID 9
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861707/BSV/qucnyrxwverzaxlb6hi4.jpg', 9, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861708/BSV/iawbyge4ei93ncgxnxat.jpg', 9, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861709/BSV/f6cuvy5wjjrltqvoeufn.jpg', 9, NULL),
    
    -- Sản phẩm ID 10
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861565/BSV/kn9tworud71vcm89zxq4.jpg', 10, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861567/BSV/xjhekkfg7zgmfleoqylj.jpg', 10, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861568/BSV/uwkbf4pnfktnwositgt8.jpg', 10, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861569/BSV/wrumjbuibvp78dmqgiue.jpg', 10, NULL),
    
    -- Sản phẩm ID 11
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861658/BSV/htmprlwswrhctp1pw8lk.jpg', 11, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861659/BSV/kqioxttu80tmr4gblxcl.jpg', 11, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861660/BSV/ggjo8ruzuxufvfw3xusd.png', 11, NULL),
    
    -- Sản phẩm ID 12
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861541/BSV/vovgy2xvwwbqesovequo.jpg', 12, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861542/BSV/tppo4tgnkbusicxouh6d.jpg', 12, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861543/BSV/fs08tthkosv9acwamjfs.jpg', 12, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861544/BSV/woyf2mcqoqfap93gemwm.jpg', 12, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861545/BSV/p85klgt4zlgngnoagit7.jpg', 12, NULL),
    
    -- Sản phẩm ID 13
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861632/BSV/wg9r2q32nm1oislzjykv.jpg', 13, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861632/BSV/iq3xdd2nppdvviii5j7n.jpg', 13, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861634/BSV/il9dxzighs6maqkhaue4.jpg', 13, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861635/BSV/tafmephh8aedb2acidyd.jpg', 13, NULL),
    
    -- Sản phẩm ID 14
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861735/BSV/h4jfxtmgb15bssikieok.jpg', 14, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861736/BSV/pidpitztkp5akdkmot3p.jpg', 14, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861736/BSV/wiznzuewbwfmvi3z7ttr.jpg', 14, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861737/BSV/nfi2te5vhakmfeo2lxqw.jpg', 14, NULL),
    
    -- Sản phẩm ID 15
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861268/BSV/m4io7zqijxyesl3din03.jpg', 15, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861269/BSV/b1t9enot6ct0bkwawkmr.jpg', 15, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861271/BSV/xdof3k8xbxe8kc1gyghv.jpg', 15, NULL),
    
    -- Sản phẩm ID 16
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861441/BSV/kdsocgblldq04k2kegm4.jpg', 16, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861442/BSV/kjhyaox3v1mdimtnq5ar.jpg', 16, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861443/BSV/mrcojnl7ueqfkdjybt20.jpg', 16, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861443/BSV/rvqfw1essbwqeefqyw1k.jpg', 16, NULL),
    
    -- Sản phẩm ID 17
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861204/BSV/hzypzghuippjzyjmrffz.jpg', 17, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861205/BSV/miaeavtnfxzz0bjco6ly.jpg', 17, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861205/BSV/eepsu5pc5jlgejhgczdh.jpg', 17, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861208/BSV/zuewcmqw326rtailytnc.jpg', 17, NULL),
    
    -- Sản phẩm ID 18
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861394/BSV/zgnbapxlft4aqwaqqbk4.jpg', 18, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861395/BSV/x8qwgjb9z9nqh2qyqgx1.jpg', 18, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861396/BSV/drmasrwnswbwej6yjaos.jpg', 18, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861397/BSV/oilwofd1jzawyd1mcyco.jpg', 18, NULL),
    
    -- Sản phẩm ID 19
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861102/BSV/xdyvx2yk2hvejm1upz1x.png', 19, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861103/BSV/yi6ttimhyie78pspapj7.jpg', 19, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861104/BSV/n5cucjiqlodhounf41v8.jpg', 19, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861106/BSV/ows2r9rkwxekebzit6il.jpg', 19, NULL),
    
    -- Sản phẩm ID 20
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110904/BSV/rwpfzmi6o80b8uucrekb.jpg', 20, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110905/BSV/yeahvvg15keh8kijsoyx.jpg', 20, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110906/BSV/mmhokyax6fmpq46xn7gc.jpg', 20, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110907/BSV/ddc4edaknokmtswxilhn.jpg', 20, NULL),
    
    -- Sản phẩm ID 21
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861045/BSV/d5tqwvse10tlhf70kvr0.png', 21, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861047/BSV/dsv2s5popz7neyi93ltx.png', 21, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861047/BSV/ywn5uetmlxzg5wmnqjxl.png', 21, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861048/BSV/qtkdwzqtjoxblgx34jxw.png', 21, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861049/BSV/ty4ama15ywdkckhre1k3.jpg', 21, NULL),
    
    -- Sản phẩm ID 22
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861303/BSV/lj4p3eh56i2xah22xu6o.jpg', 22, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861304/BSV/dulwkewfw8wt3yprri6z.jpg', 22, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861305/BSV/yhnmzdtfuut4aecdwmzi.jpg', 22, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861306/BSV/nw8stzbfvg2ke1kd8ahy.jpg', 22, NULL),
    
    -- Sản phẩm ID 23
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861474/BSV/ce6nglmfjnefqfo4kafv.jpg', 23, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861475/BSV/wczdsrxcslsgjax7puyd.jpg', 23, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861476/BSV/dxetanztdiclpg6k9oxz.jpg', 23, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861477/BSV/aqtd6ahmp9jub00dgn6k.jpg', 23, NULL),
    
    -- Sản phẩm ID 24
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861238/BSV/q79912khww1vpnx8jrsy.jpg', 24, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861239/BSV/bvqiwrmbqjtam3wvmm16.jpg', 24, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861240/BSV/nz8qznm4grmd1tkzpjhm.jpg', 24, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861240/BSV/p4mghwux5ux3blpj45ye.jpg', 24, NULL),
    
    -- Sản phẩm ID 25
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861419/BSV/ztw1fa0lffiq1yqjf5rb.jpg', 25, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861420/BSV/ixrrliykjae8jakvcpk5.jpg', 25, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861420/BSV/q7nfsfwtzxm9ehizlrmt.jpg', 25, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861421/BSV/liboyou6hyv3aputj11i.jpg', 25, NULL),
    
    -- Sản phẩm ID 26
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861176/BSV/qfmypwwyjriyl8jopdld.jpg', 26, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861176/BSV/vfibdbmqqo9fodjhyflu.png', 26, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861177/BSV/ijuasu1oqri3cnjafvdb.jpg', 26, NULL),
    
    -- Sản phẩm ID 27
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861366/BSV/exg0xuq4uknoqsjgc5la.jpg', 27, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861367/BSV/egxnxn0zhvjgbynauosi.jpg', 27, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861367/BSV/hle4uktnieosd6x94cei.jpg', 27, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861368/BSV/yl3fax9kyxiqnpdlcbgi.jpg', 27, NULL),
    
    -- Sản phẩm ID 28
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861073/BSV/yt2iiq8guanwu0kg3dw2.jpg', 28, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861074/BSV/v3vqbmbubhayzzj635ix.jpg', 28, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861075/BSV/xznel25rwswrfqb4g0wn.jpg', 28, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861076/BSV/e8kr6hzj4vlhlpdk31ga.jpg', 28, NULL),
    
    -- Sản phẩm ID 29
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861330/BSV/hu4bgqkndpilyieuwvhr.jpg', 29, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861331/BSV/od1brxalwdkaougfvlvp.png', 29, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861332/BSV/eqfeoru1rhrsfrn7crnm.jpg', 29, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767861333/BSV/pujzijek0pqwmvk7rbmp.jpg', 29, NULL),
    
    -- Sản phẩm ID 30
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860794/BSV/rjat4fsahdstyupbxwz2.jpg', 30, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860795/BSV/naj45ubxqsrrijmtn4ng.jpg', 30, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860796/BSV/z98ms6imec4puiiwdjlx.jpg', 30, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860797/BSV/xehgsigox6yjqqzbyb1w.jpg', 30, NULL),
    
    -- Sản phẩm ID 31
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860905/BSV/ycm3koyz7ztssg7lhtzx.jpg', 31, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860906/BSV/l8gwrxklrwdh8l3i0dng.jpg', 31, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860907/BSV/wpwszujjdt40fn1pi5lz.jpg', 31, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860908/BSV/crm5zqbyhamji9zdouty.jpg', 31, NULL),
    
    -- Sản phẩm ID 32
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860751/BSV/hgenrbheg1xvfteofft1.jpg', 32, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860751/BSV/vkvvae6m4c2hbbnvq9di.jpg', 32, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860752/BSV/klkvbjar9ldhhsn4e0u0.jpg', 32, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860753/BSV/gj1j81pnwgyhmeuocrab.jpg', 32, NULL),
    
    -- Sản phẩm ID 33
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860862/BSV/pg8cbxbzxjsce2vr42nj.jpg', 33, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860863/BSV/nl0c940bvnnzbnypf8yr.jpg', 33, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860864/BSV/mcmvkjajecyl5pb9uyxw.jpg', 33, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860864/BSV/brirr3ffsqsruu9l4ya2.jpg', 33, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860865/BSV/cjjoq8yn8gzn8775j3wy.jpg', 33, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860866/BSV/eixmvhli635i7jt1tt5s.jpg', 33, NULL),
    
    -- Sản phẩm ID 34
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860977/BSV/yd0ds0heyo91glvmyomm.jpg', 34, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860978/BSV/tz4bkjmpgijmjec2zl2c.jpg', 34, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860979/BSV/imwv4jcuaol9tbdhr1nl.jpg', 34, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860979/BSV/pc04hibop4fwyyexabng.jpg', 34, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860980/BSV/zte0skepk7knlxcczgpz.jpg', 34, NULL),
    
    -- Sản phẩm ID 35
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860843/BSV/djld7mhvzktitvqafepn.jpg', 35, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860844/BSV/cpef5b07ffpwgsjxuh9b.jpg', 35, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860844/BSV/rbfcracuule7xp96lozh.jpg', 35, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860845/BSV/u2ahiiaxxicd11aispkr.jpg', 35, NULL),
    
    -- Sản phẩm ID 36
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860946/BSV/tuitpccw5elrvjjnyobg.jpg', 36, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860948/BSV/olx5rijuoitjnsguapik.jpg', 36, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860951/BSV/vkhlgguzjsuz6g5qgups.jpg', 36, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860952/BSV/m9htpxcdghg3rqbgpkzq.jpg', 36, NULL),
    
    -- Sản phẩm ID 37
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860818/BSV/rhvm7uumaphcow8i3eca.jpg', 37, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860819/BSV/smk6zc0hx51pdqju77pd.jpg', 37, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860820/BSV/l0o5deqnemjwo7hisagi.jpg', 37, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860821/BSV/fzmvb1kpt09zjbkyxmrb.jpg', 37, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860822/BSV/jzcv32ifkc8eus3lpmpy.jpg', 37, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860823/BSV/xwjnk8xix0krxceujyqv.jpg', 37, NULL),
    
    -- Sản phẩm ID 38
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860925/BSV/mhqazzmfzzuastk2lsdc.jpg', 38, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860927/BSV/mfru5gvpmcftet6qzums.png', 38, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860928/BSV/kwaktidvhrgex8aqulwh.jpg', 38, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860928/BSV/eif3ok8qgkccuq0ryced.jpg', 38, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860929/BSV/gzn16vmgdoaiomo7rov8.jpg', 38, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860930/BSV/p7ywiapbk3hkkhzq9vxo.jpg', 38, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860930/BSV/evxukykcwan9hnr5ftcj.jpg', 38, NULL),
    
    -- Sản phẩm ID 39
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860774/BSV/j9lciyjtggnsa2pqmxgz.jpg', 39, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860775/BSV/mmlyvww2kmu00saspivr.jpg', 39, NULL),
    
    -- Sản phẩm ID 40
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860886/BSV/kcjhudwypcnr98dbagez.jpg', 40, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860887/BSV/naqytfskn9xxwxg1z4nt.jpg', 40, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860888/BSV/vpcrfvhwxfpcvouqmxss.jpg', 40, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860889/BSV/whi6rqwxksbjxi563x0d.jpg', 40, NULL),
    
    -- Sản phẩm ID 41
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860997/BSV/ydqxqxrf9eb5ctfsa7fn.jpg', 41, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860997/BSV/a5hjtkgyoup91bhibg22.jpg', 41, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860998/BSV/tvk0xpprthyemwbxgrrl.jpg', 41, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860999/BSV/me02d73ca8j962poiyd6.jpg', 41, NULL),
    
    -- Sản phẩm ID 42
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860610/BSV/szh0u3zy3nkev1vzgr0s.jpg', 42, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860610/BSV/pabwoyvj09o4kqoijtxk.jpg', 42, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860611/BSV/nazswe8rvl4pikgpfbs2.webp', 42, NULL),
    
    -- Sản phẩm ID 43
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860690/BSV/t8r8solgfuqdrm8s5va4.webp', 43, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860690/BSV/hf4cu9i7xpwfgv8ftr93.jpg', 43, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860691/BSV/wg7rbufpext5ymlhmleq.webp', 43, NULL),
    
    -- Sản phẩm ID 44
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860567/BSV/hlvjkay6doaqfmbzvukc.jpg', 44, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860568/BSV/kmeney5rvcykudqklq18.jpg', 44, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860569/BSV/yx4wypbptqcilisgoiat.png', 44, NULL),
    
    -- Sản phẩm ID 45
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860670/BSV/hit3scnmuqgy7uadaw3s.jpg', 45, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860671/BSV/enupkugny3rrgqz5grzp.jpg', 45, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860672/BSV/frnxmwy3ot4pndnfarvc.jpg', 45, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860672/BSV/mlkc3fho0zyhwemb0nul.jpg', 45, NULL),
    
    -- Sản phẩm ID 46
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860543/BSV/ie1dirqppylscafqmbmr.jpg', 46, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860544/BSV/q4yfd0pz06t9g9ysjzy2.jpg', 46, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860544/BSV/hdx7tvtmmbiydmrxkppl.jpg', 46, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860545/BSV/io7zzy8kdtgjy1gzeyos.jpg', 46, NULL),
    
    -- Sản phẩm ID 47
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860649/BSV/dre1omgg0efzlgtg8m2a.jpg', 47, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860650/BSV/rzazxgotlxugmgvlxagh.jpg', 47, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860651/BSV/ruwcei4jhvtfryoqzyg5.jpg', 47, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860651/BSV/ehfmi1b2p0hibcuqu9ck.jpg', 47, NULL),
    
    -- Sản phẩm ID 48
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860520/BSV/fdmlwfhu0evxkmarriif.jpg', 48, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860520/BSV/eysgcj2ui8ddk0ueimix.jpg', 48, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860521/BSV/aifh5qsnse0hcn3esk6w.jpg', 48, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860522/BSV/hn6vi8c9sr3xwq1p3fto.jpg', 48, NULL),
    
    -- Sản phẩm ID 49
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860628/BSV/wv8bhydoahlsdtywdiki.jpg', 49, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860629/BSV/fqu2wqh6xrwr8kxj99ts.jpg', 49, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860629/BSV/qwnw27ilsp56tuzvfhbj.jpg', 49, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860630/BSV/jcdj53nc1gtfmldrer6j.jpg', 49, NULL),
    
    -- Sản phẩm ID 50
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860716/BSV/t2hnffhtd9cipy48w7ov.jpg', 50, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860717/BSV/m7yelnpnhmbczkodxbv3.jpg', 50, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860717/BSV/noogh3pztaklejcp7wh4.jpg', 50, NULL),
    
    -- Sản phẩm ID 51
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860589/BSV/nv2osg9r2ym0dtx6cpad.jpg', 51, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860590/BSV/watihk4qegbn8xkmcmo0.jpg', 51, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860591/BSV/o3pymt9k2pzs8xqdywgf.jpg', 51, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860592/BSV/ju2lzbn9adiggfluijex.jpg', 51, NULL),
    
    -- Sản phẩm ID 52
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111154/BSV/xoah5ym1wbw6hp1g5dua.jpg', 52, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111156/BSV/e2bgptxexwhmmlmwb3zx.jpg', 52, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111158/BSV/yuyahponhvr4c3j3e4fe.jpg', 52, NULL),
    
    -- Sản phẩm ID 53
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860134/BSV/h9tzusyxu1ulygb9valh.jpg', 53, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860135/BSV/mkzkxngk0lrjxzsbh5ds.jpg', 53, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860136/BSV/psrkodmw11ynqv0dveey.jpg', 53, NULL),
    
    -- Sản phẩm ID 54
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860225/BSV/kdjxsuswzkl3ianmwsl3.jpg', 54, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860226/BSV/a2gvajqcivfwo4ux0gfv.jpg', 54, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860227/BSV/res7gkgfygwcjv6juw5q.jpg', 54, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860228/BSV/elnqtuqouirvc0pkupbl.jpg', 54, NULL),
    
    -- Sản phẩm ID 55
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860116/BSV/j4zsb2peazilff5qcb6w.jpg', 55, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860116/BSV/hqhqr3t8uriz8m0ksqcs.jpg', 55, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860117/BSV/ii0plpk3bp0pymfg35en.jpg', 55, NULL),
    
    -- Sản phẩm ID 56
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859935/BSV/midhypvarodrxwbavruq.jpg', 56, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859936/BSV/ikjduxe67h4mv4xys9yl.jpg', 56, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859937/BSV/cavpr53boaym7brcpgh0.png', 56, NULL),
    
    -- Sản phẩm ID 57
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860035/BSV/csaops1ldf9g0ppdr2j3.png', 57, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860036/BSV/mhu09e6nffrf58idbife.webp', 57, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860036/BSV/vjm7ce8hijohxk9do6vc.jpg', 57, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860037/BSV/hiwe6zcyabe6vqqcojvp.png', 57, NULL),
    
    -- Sản phẩm ID 58
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859847/BSV/agxhgiwgj2bysesabze7.jpg', 58, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859847/BSV/ws3j0myrytof4tqs7jcz.jpg', 58, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859848/BSV/whey32jyfzxlutqxjo5f.png', 58, NULL),
    
    -- Sản phẩm ID 59
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111265/BSV/thq63ee3jzoxfarkksrw.webp', 59, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111266/BSV/jbm2jmcpags1bfsz6tir.jpg', 59, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111269/BSV/o33gwf9kofdqxkiq2lcd.jpg', 59, NULL),
    
    -- Sản phẩm ID 60
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860193/BSV/sdqemip7zqiwl0b8oj9f.webp', 60, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860193/BSV/b2usdj3l5fakv1obughy.jpg', 60, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860194/BSV/nicupie30bouppa8enyh.jpg', 60, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860194/BSV/xdpbxo5ubfwjamfjog9j.webp', 60, NULL),
    
    -- Sản phẩm ID 61
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860259/BSV/mn0vxhmr3tc3dyfce3tt.jpg', 61, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860259/BSV/yfq4qqp6fm8rfwlky68t.jpg', 61, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860260/BSV/hxeujiso77s9pwx58bou.jpg', 61, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767860261/BSV/tjken8tl71utvcbxnit8.jpg', 61, NULL),
    
    -- Sản phẩm ID 62
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859604/BSV/u3nijasryfcvasdsj32u.png', 62, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859606/BSV/cp7yfgjaqc6i2sovoyjl.jpg', 62, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859607/BSV/wfxelhc1cn4eyfgn6per.jpg', 62, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859608/BSV/i1fxx4f8rsot9uuiodng.png', 62, NULL),
    
    -- Sản phẩm ID 63
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859695/BSV/qouk09zjtbmvipzyn8ih.png', 63, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859695/BSV/unowqtl4tq9hfuivi1xq.png', 63, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859697/BSV/wye5qeqewaoogevb0zrk.jpg', 63, NULL),
    
    -- Sản phẩm ID 64
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859581/BSV/saequjourh2sej0jx23a.jpg', 64, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859582/BSV/icsl9bi142lrv3giv8aq.jpg', 64, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859584/BSV/wztec0gfn5o5ifueyhnn.jpg', 64, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859585/BSV/skhqksows882ks5ywd9s.jpg', 64, NULL),
    
    -- Sản phẩm ID 65
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859673/BSV/ljsjd3u8xipljttvvzbv.jpg', 65, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859674/BSV/kdkz6filj8jae5gplye8.jpg', 65, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859675/BSV/fttt7cwjmgwm72v2rvep.jpg', 65, NULL),
    
    -- Sản phẩm ID 66
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859741/BSV/n8uvjd2reinehmj2riwm.png', 66, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859742/BSV/lb6jeopzatgypii9td4j.png', 66, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859744/BSV/xa1hpzp0zdct5nycxt5q.png', 66, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859746/BSV/lxgt6vxmtgf5lyli8p11.png', 66, NULL),
    
    -- Sản phẩm ID 67
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859653/BSV/gbpzojwnzdh325htmrel.jpg', 67, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859655/BSV/utibgvy1aumtlf3ccidh.png', 67, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859656/BSV/zrl5n8nkmnsishr86lky.jpg', 67, NULL),
    
    -- Sản phẩm ID 68
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110967/BSV/ouzun6ikp6kcn54ih8m7.jpg', 68, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110967/BSV/wj5dtcciscurrckx9ufo.jpg', 68, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110968/BSV/il6yy3xmyjh2y3or1hvc.jpg', 68, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110969/BSV/traohondawwmjziptdbg.jpg', 68, NULL),
    
    -- Sản phẩm ID 69
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859630/BSV/z3mbvdheeskjrprhos9a.jpg', 69, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859631/BSV/v1yogrdovbhi5ppn1qbp.jpg', 69, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859634/BSV/oe0nm35bcetfcbesq4nk.jpg', 69, NULL),
    
    -- Sản phẩm ID 70
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859716/BSV/mpnagohudwx3zyrhsoa3.png', 70, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859717/BSV/yaqjm8fipsow5ynovgia.png', 70, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859717/BSV/ygsfi9iofotlrf2fbwiq.png', 70, NULL),
    
    -- Sản phẩm ID 71
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859238/BSV/z7tliszs052tx7aikkku.jpg', 71, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859240/BSV/sb3sbboxqcyhggpnz90d.jpg', 71, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859242/BSV/vhkoifmo0eusy4hzxyix.jpg', 71, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859242/BSV/frybseo1xuvjrnmw9vtk.jpg', 71, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859243/BSV/t2zelg8bivg5tzmuiz2g.jpg', 71, NULL),
    
    -- Sản phẩm ID 72
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859513/BSV/kywanwlx0ddfryfzwj7s.jpg', 72, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859515/BSV/er6a267ltd3hvivahnb6.jpg', 72, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859516/BSV/uhiivftzoknzdh7ti5re.jpg', 72, NULL),
    
    -- Sản phẩm ID 73
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859461/BSV/uzyalliiy8jrqtizvmg4.jpg', 73, NULL),
    
    -- Sản phẩm ID 74
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859329/BSV/kyngiztckbp8kkhsbeuf.jpg', 74, NULL),
    
    -- Sản phẩm ID 75
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859412/BSV/cai4abuazxznge2cltww.jpg', 75, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859413/BSV/iwu7xo5qkstwtbznzazg.jpg', 75, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859414/BSV/vtnpuflizxzszub5jrku.jpg', 75, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859415/BSV/oqkcy34aghlxonvx2p1d.jpg', 75, NULL),
    
    -- Sản phẩm ID 76
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859207/BSV/hzqjvbrpqwvzyncoymy5.jpg', 76, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859208/BSV/bugetvxkupzcboefd8it.jpg', 76, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859209/BSV/xyp0g6uire3ue2lfxoa6.jpg', 76, NULL),
    
    -- Sản phẩm ID 77
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859542/BSV/vyadw7ppvrdtqqbkjosd.jpg', 77, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859543/BSV/yzuzznaog1d6whrzsnjk.jpg', 77, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859544/BSV/v6e5smn7xbm90jpwskmk.png', 77, NULL),
    
    -- Sản phẩm ID 78
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859268/BSV/hhovsdgzae1n5vuuuzzs.jpg', 78, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859269/BSV/gtu06yrmxtol47fpvkxp.jpg', 78, NULL),
    
    -- Sản phẩm ID 79
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113942/BSV/mnbv99pns6h4zcqossk4.jpg', 79, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113943/BSV/mg6pa3l8bldj6ou8zgj6.jpg', 79, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113943/BSV/rbg9tfcshnqs1sfkkvwk.jpg', 79, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767113945/BSV/ng3tyfjnljnz2z7s7qlg.jpg', 79, NULL),
    
    -- Sản phẩm ID 80
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859129/BSV/c2t1nlc10kelpuoah9nz.jpg', 80, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859130/BSV/dh9ts08nibhpmftjwk2w.jpg', 80, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859130/BSV/flecd7nhcnhyu48wxccp.jpg', 80, NULL),
    
    -- Sản phẩm ID 81
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859361/BSV/ntr2b0hnzifgwdpuga6p.jpg', 81, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859362/BSV/dw6ywl6illy77kwzilxw.jpg', 81, NULL),
    
    -- Sản phẩm ID 82
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859439/BSV/qkcd7in6brivycelc98v.jpg', 82, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859440/BSV/ebamufvyhtu4zop1mh7w.jpg', 82, NULL),
    
    -- Sản phẩm ID 83
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859295/BSV/bdkup6cmxbqmusqrdvj0.jpg', 83, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859297/BSV/hmlzg9aak5eqkfuicnen.jpg', 83, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859297/BSV/jf4l1c0tpwgxrsvvarp0.jpg', 83, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767859298/BSV/i709euxb8kxwyq3fpfbh.jpg', 83, NULL),
    
    -- Sản phẩm ID 84
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110843/BSV/yyk2tx4tq9ecxp8sjalx.jpg', 84, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767110844/BSV/ftagp4lnzrahsroa24d6.jpg', 84, NULL),
    
    -- Sản phẩm ID 85
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858674/BSV/a9db8boiva9qq6ybsoak.jpg', 85, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858675/BSV/e4qlblvaq901lqiwfq06.jpg', 85, NULL),
    
    -- Sản phẩm ID 86
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858870/BSV/v90eljjm0bz664utano9.jpg', 86, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858871/BSV/k8j6e7rjihex08fxzueb.jpg', 86, NULL),
    
    -- Sản phẩm ID 87
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858523/BSV/ks8hl61zwyw7cgkf1ze7.jpg', 87, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858524/BSV/iz1ymgvhxrb4ckremt2g.jpg', 87, NULL),
    
    -- Sản phẩm ID 88
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858839/BSV/gs0ppjpv1avsdmqpmb9v.jpg', 88, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858840/BSV/ksrukq7fehgcn2fut2z4.jpg', 88, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858841/BSV/kpwyn14vgpci5syyxzux.jpg', 88, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858842/BSV/wiybewlntgxaslobwhcu.jpg', 88, NULL),
    
    -- Sản phẩm ID 89
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858481/BSV/rzax6piig6ofdxvkp7g3.jpg', 89, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858482/BSV/stoplgxehufcknn83plm.jpg', 89, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858482/BSV/lvdyh5ybpiqhtkd1gzvv.jpg', 89, NULL),
    
    -- Sản phẩm ID 90
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858804/BSV/ul5j1abujyfl66snbmmp.png', 90, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858805/BSV/fpkmlojmk1vdg3ypba5v.png', 90, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858806/BSV/kmlklmpzpa3l60j7mabg.jpg', 90, NULL),
    
    -- Sản phẩm ID 91
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858293/BSV/wkua9yd9pzqdjgtgkw9w.jpg', 91, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858294/BSV/zuvexpsu92u7ztwve6af.jpg', 91, NULL),
    
    -- Sản phẩm ID 92
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858707/BSV/dhu3bw87tswsqewjhtzm.jpg', 92, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858708/BSV/b3ufpnorzpmwx9ii6igc.jpg', 92, NULL),
    
    -- Sản phẩm ID 93
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858954/BSV/nbz6oeptrfq9ucawcppm.jpg', 93, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858956/BSV/wuo6twm0sxx9bwubiofd.jpg', 93, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858956/BSV/rzcsxoceydv36kdm5nir.jpg', 93, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858957/BSV/ocdfi5keyldxc2sqxp4u.jpg', 93, NULL),
    
    -- Sản phẩm ID 94
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858556/BSV/xc7xypuboivrivhgcxmp.jpg', 94, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858557/BSV/aqejtr8gj3ggfnqgjqbn.jpg', 94, NULL),
    
    -- Sản phẩm ID 95
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858250/BSV/lyymbgqe4bvziwwwwj6y.jpg', 95, NULL),
    
    -- Sản phẩm ID 96
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858364/BSV/kc4hgwkjhcrrayf8rzln.jpg', 96, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858366/BSV/sjwmpu7ujis7qjyl2qmq.jpg', 96, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858367/BSV/hsqfaas2y5fxfipfbb7k.jpg', 96, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858368/BSV/jakaim2lp6m2dek9omw7.jpg', 96, NULL),
    
    -- Sản phẩm ID 97
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857916/BSV/c67lznvedu4gdjp9bhgh.png', 97, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857917/BSV/yvphiywxqejmvy2yuwjy.jpg', 97, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857919/BSV/zf8oaycsex7bkwla595o.jpg', 97, NULL),
    
    -- Sản phẩm ID 98
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858326/BSV/fyv2pzwxlbutjc9s6nyk.jpg', 98, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858327/BSV/jdzcx1qaysgn0bkyuwyd.jpg', 98, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858328/BSV/xcxr8ktyuiy4jbjkkhp8.jpg', 98, NULL),
    
    -- Sản phẩm ID 99
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858763/BSV/fkuoat0fjyqryzys3bnb.jpg', 99, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858764/BSV/nj7hba9c6wnj83qwwbil.jpg', 99, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858764/BSV/copjuxyh0zer51aiu3tq.jpg', 99, NULL),
    
    -- Sản phẩm ID 100
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111212/BSV/zjos3acwlutr4ylsmddq.jpg', 100, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111213/BSV/gmc5gejreuvt3hlp52xf.jpg', 100, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767111214/BSV/vg4wlelysxtnkbrngepc.jpg', 100, NULL),
    
    -- Sản phẩm ID 101
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858415/BSV/qa1hyt0hbvqpohjpgyvp.png', 101, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858416/BSV/w2tbykatsdsxzbrlpdg9.jpg', 101, NULL),
    
    -- Sản phẩm ID 102
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858923/BSV/jynydctcxvbdvnzcbelw.jpg', 102, NULL),
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858923/BSV/a4hgigpzwdrhenhfx7ud.jpg', 102, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858924/BSV/oew7kjxhhz6dv8gbbno4.jpg', 102, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767858925/BSV/epozbvgdadrbgh5g1j4m.jpg', 102, NULL),
    
    -- Sản phẩm ID 103
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857765/BSV/i95gl1ysnkzxyjo2gmvk.jpg', 103, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857767/BSV/svpuflzi9j5sl68fhurm.jpg', 103, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857768/BSV/frqtzfkzjrx7ekowiivx.jpg', 103, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857768/BSV/z2mgeyhv1megv4e7w3px.jpg', 103, NULL),
    
    -- Sản phẩm ID 104
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857655/BSV/idpwpbakccm302epwfjd.jpg', 104, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857656/BSV/fztdgpfctpzeenqbe8cj.jpg', 104, NULL),
    
    -- Sản phẩm ID 105
    (1, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857699/BSV/nufnbf8c9bepvqrqn7nc.jpg', 105, NULL),
    (0, 'https://res.cloudinary.com/dratk1jhg/image/upload/v1767857700/BSV/dlfziy0xwdar1zietw0g.jpg', 105, NULL);

-- Dữ liệu mẫu cho Comments đã được sửa để tuân thủ UNIQUE KEY (user_id, product_id)
INSERT INTO Comments (rate, content, product_id, user_id, created_at, updated_at, likes, dislikes) VALUES
-- Dữ liệu gốc đã thêm likes/dislikes
(5, 'Bánh pía Sóc Trăng ngon tuyệt, nhân sầu riêng thơm lừng, béo ngậy. Sẽ ủng hộ shop dài dài.', 1, 1, '2025-09-20 10:15:00', '2025-09-20 10:15:00', 85, 2),
(4, 'Bò một nắng Krông Pa thịt mềm, tẩm ướp đậm đà, rất hợp khẩu vị. Chấm với muối kiến vàng là hết sảy.', 2, 2, '2025-09-21 12:30:00', '2025-09-21 12:30:00', 92, 5),
(3, 'Cà phê Buôn Ma Thuột thơm, nhưng vị hơi gắt so với gu của mình. Nói chung là ổn.', 3, 3, '2025-09-22 14:00:00', '2025-09-22 14:00:00', 45, 11),
(5, 'Chả ốc dai giòn sần sật, thơm mùi lá lốt. Chấm tương ớt ăn cực cuốn, rất ngon!', 4, 4, '2025-09-23 16:45:00', '2025-09-23 16:45:00', 100, 0),
(4, 'Dê chiên giòn Tây Ninh thơm, lớp vỏ giòn rụm nhưng thịt bên trong không bị khô. Ăn khá ổn.', 5, 5, '2025-09-24 09:20:00', '2025-09-24 09:20:00', 73, 6),
(2, 'Món gân bò rau tiến vua hơi mặn so với mong đợi của mình. Gân bò thì giòn nhưng nước sốt cần điều chỉnh lại.', 6, 1, '2025-09-25 11:10:00', '2025-09-25 11:10:00', 21, 15),
(5, 'Hạt điều rang muối Bình Phước hạt to, giòn rụm, béo ngậy. Ăn cực đã, không bị hôi dầu.', 7, 2, '2025-09-26 13:35:00', '2025-09-26 13:35:00', 95, 2),
(4, 'Mắm tép chưng thịt đậm đà, thơm mùi riềng, ăn với cơm trắng rất tốn cơm. Giao hàng nhanh.', 8, 3, '2025-09-27 15:00:00', '2025-09-27 15:00:00', 88, 4),
(3, 'Mật ong rừng U Minh hơi đặc, nhưng có mùi thơm tràm đặc trưng. Vẫn ok.', 9, 4, '2025-09-27 16:20:00', '2025-09-27 16:20:00', 50, 8),
(5, 'Mè xửng Huế dẻo thơm, ngọt vừa phải, đậu phộng giòn bùi. Đúng chuẩn hương vị Huế, rất ngon.', 10, 5, '2025-09-27 17:45:00', '2025-09-27 17:45:00', 98, 1),
(5, 'Chả mực Hạ Long giã tay dai giòn sần sật, thơm nức. Đắt nhưng xắt ra miếng, chất lượng tuyệt vời.', 21, 6, '2025-09-28 09:05:00', '2025-09-28 09:05:00', 99, 1),
(4, 'Bề bề rang muối đậm đà, vỏ giòn. Thịt tươi ngọt nhưng hơi ít.', 15, 7, '2025-09-28 10:10:00', '2025-09-28 10:10:00', 65, 7),
(5, 'Nem chua Thanh Hóa chuẩn vị, chua cay vừa phải, thơm mùi tỏi ớt và lá ổi. Sẽ mua lại.', 92, 8, '2025-09-28 11:25:00', '2025-09-28 11:25:00', 93, 3),
(4, 'Chả cốm Hà Nội dẻo thơm, cảm nhận được hạt cốm bên trong. Chiên lên ăn nóng rất ngon.', 88, 9, '2025-09-28 14:00:00', '2025-09-28 14:00:00', 82, 4),
(5, 'Hạt điều to, đều, không bị vỡ. Rang muối vừa miệng, bùi và béo. Đóng gói cẩn thận.', 56, 10, '2025-09-29 08:30:00', '2025-09-29 08:30:00', 91, 2),
(5, 'Cua Cà Mau chắc thịt, gạch đầy ụ. Shop giao hàng sống, cua rất khỏe và tươi. Rất hài lòng.', 23, 1, '2025-09-29 12:00:00', '2025-09-29 12:00:00', 100, 0),
(3, 'Gà ủ muối da giòn, thịt dai nhưng hơi nhạt so với khẩu vị của gia đình mình.', 47, 2, '2025-09-29 15:45:00', '2025-09-29 15:45:00', 40, 12),
(5, 'Ruốc thịt lợn sợi bông, tơi, vàng ươm và rất thơm. Bé nhà mình rất thích ăn với cháo.', 37, 3, '2025-09-30 09:50:00', '2025-09-30 09:50:00', 89, 1),
(4, 'Vịt quay da giòn, thịt mềm, tẩm ướp vừa phải. Nước chấm đi kèm cũng khá ngon.', 68, 4, '2025-09-30 11:00:00', '2025-09-30 11:00:00', 79, 5),
(4, 'Thịt heo sấy khô đậm đà vị mắc khén, cay cay ngọt ngọt. Nhâm nhi xem phim là hết bài.', 100, 5, '2025-09-30 16:20:00', '2025-09-30 16:20:00', 85, 6),
(5, 'Nem hải sản vỏ giòn tan, nhân bên trong béo ngậy vị mayonnaise và hải sản. Rất đáng thử!', 27, 6, '2025-10-01 10:30:00', '2025-10-01 10:30:00', 96, 2),
(5, 'Trà sen Tây Hồ thơm dịu, vị thanh khiết. Uống một tách trà vào buổi sáng cảm thấy rất thư thái.', 13, 7, '2025-10-01 13:00:00', '2025-10-01 13:00:00', 90, 3),
(4, 'Hạt Macca sấy nứt vỏ dễ tách, hạt to tròn, ăn béo và thơm. Chất lượng tốt.', 57, 8, '2025-10-02 11:15:00', '2025-10-02 11:15:00', 77, 4),
(4, 'Pate gan vịt béo ngậy, mềm mịn, thơm mùi đặc trưng. Ăn kèm bánh mì nướng là tuyệt vời.', 67, 9, '2025-10-02 14:40:00', '2025-10-02 14:40:00', 83, 3),
(5, 'Chả cá thác lác Hậu Giang dai ngon, thơm mùi thì là. Nấu lẩu hay chiên đều ngon.', 82, 10, '2025-10-03 09:00:00', '2025-10-03 09:00:00', 94, 2),
(5, 'Mè xửng dẻo, thơm, ngọt thanh. Mua làm quà ai cũng khen.', 10, 3, '2025-10-05 09:10:00', '2025-10-05 09:10:00', 77, 1),
(4, 'Ăn cũng được, hơi dính răng một chút nhưng vị ngon.', 10, 7, '2025-10-05 11:25:00', '2025-10-05 11:25:00', 42, 3),
(5, 'Đúng chuẩn mè xửng Huế, đậu phộng giòn, không bị hôi dầu. Rất hài lòng.', 10, 10, '2025-10-05 14:00:00', '2025-10-05 14:00:00', 89, 0),
(3, 'Hơi ngọt so với mình, nhưng gia đình thì thích.', 10, 1, '2025-10-05 16:45:00', '2025-10-05 16:45:00', 31, 9),
(5, 'Tuyệt vời! Sẽ mua thêm để biếu.', 10, 9, '2025-10-05 18:20:00', '2025-10-05 18:20:00', 95, 2),
(4, 'Bánh pía ngon, nhân sầu riêng thơm nhưng hơi ngọt gắt.', 1, 6, '2025-10-06 08:30:00', '2025-10-06 08:30:00', 58, 4),
(5, 'Bò một nắng rất mềm và thấm vị. Giao hàng nhanh.', 2, 8, '2025-10-06 09:45:00', '2025-10-06 09:45:00', 91, 2),
(4, 'Cà phê đậm đà, thơm nức. Pha phin uống buổi sáng là hết ý.', 3, 10, '2025-10-06 10:15:00', '2025-10-06 10:15:00', 67, 3),
(5, 'Chả ốc giòn sần sật, rất ngon. Sẽ ủng hộ shop tiếp tục.', 4, 1, '2025-10-06 11:00:00', '2025-10-06 11:00:00', 100, 0),
(3, 'Dê chiên hơi khô, không được như mình mong đợi.', 5, 10, '2025-10-06 12:30:00', '2025-10-06 12:30:00', 25, 11),
(4, 'Gân bò giòn, rau tiến vua cũng giòn, ăn vui miệng nhưng hơi mặn.', 6, 3, '2025-10-06 14:00:00', '2025-10-06 14:00:00', 48, 6),
(5, 'Hạt điều rang muối rất ngon, hạt to đều, không bị vỡ vụn.', 7, 7, '2025-10-06 15:20:00', '2025-10-06 15:20:00', 93, 1),
(5, 'Mắm tép chưng thịt này ăn với cơm trắng thì không còn gì bằng.', 8, 9, '2025-10-06 16:50:00', '2025-10-06 16:50:00', 82, 3),
(4, 'Mật ong thơm mùi hoa tràm đặc trưng, chất lượng tốt.', 9, 10, '2025-10-06 18:00:00', '2025-10-06 18:00:00', 60, 2),
(5, 'Bánh pía giao nhanh, date mới, ăn rất thơm ngon.', 1, 2, '2025-10-07 09:05:00', '2025-10-07 09:05:00', 76, 1),
(2, 'Bò một nắng bị dai và mặn, không ngon như quảng cáo.', 2, 10, '2025-10-07 10:30:00', '2025-10-07 10:30:00', 15, 20),
(4, 'Cà phê ổn, gu mình thích đắng hơn chút nữa.', 3, 5, '2025-10-07 11:45:00', '2025-10-07 11:45:00', 51, 5),
(5, 'Chả ốc này chiên lên ăn với bún đậu là hết bài.', 4, 6, '2025-10-07 13:00:00', '2025-10-07 13:00:00', 99, 1),
(4, 'Dê chiên giòn ăn được, chấm với tương ớt khá hợp.', 5, 4, '2025-10-07 14:10:00', '2025-10-07 14:10:00', 63, 7),
(4, 'Hạt điều béo, bùi, rang muối vừa miệng. Sẽ mua lại.', 7, 8, '2025-10-07 15:30:00', '2025-10-07 15:30:00', 88, 3),
(3, 'Mắm tép hơi ngọt so với khẩu vị miền Bắc của mình.', 8, 1, '2025-10-07 17:00:00', '2025-10-07 17:00:00', 39, 8),
-- Sửa lỗi: user_id=10 đã comment cho product_id=9. Đổi user_id thành 1.
(5, 'Mật ong rất đặc và thơm, pha nước chanh uống rất ngon.', 9, 1, '2025-10-07 18:45:00', '2025-10-07 18:45:00', 85, 2),
(5, 'Bánh pía trứng muối tan chảy ngon lắm shop ơi.', 1, 9, '2025-10-08 08:55:00', '2025-10-08 08:55:00', 92, 2),
(5, 'Bò một nắng chấm muối kiến vàng là đặc sản, rất đáng thử.', 2, 3, '2025-10-08 10:00:00', '2025-10-08 10:00:00', 96, 1),
-- Sửa lỗi: user_id=10 đã comment cho product_id=3. Đổi user_id thành 6.
(3, 'Cà phê bị cháy khét, uống không thơm.', 3, 6, '2025-10-08 11:20:00', '2025-10-08 11:20:00', 22, 14),
(5, 'Chả ốc ngon, giòn, thơm. Giao hàng nhanh chóng.', 4, 2, '2025-10-08 12:40:00', '2025-10-08 12:40:00', 97, 0),
-- Sửa lỗi: user_id=10 đã comment cho product_id=5. Đổi user_id thành 1.
(4, 'Dê chiên giòn, lớp vỏ mỏng, thịt bên trong mềm.', 5, 1, '2025-10-08 14:00:00', '2025-10-08 14:00:00', 71, 4),
(1, 'Gân bò quá mặn, không ăn được. Shop nên xem lại công thức.', 6, 5, '2025-10-08 15:15:00', '2025-10-08 15:15:00', 5, 30),
(5, 'Hạt điều chất lượng cao, đáng tiền.', 7, 4, '2025-10-08 16:30:00', '2025-10-08 16:30:00', 90, 1),
(4, 'Mắm tép ăn với xôi trắng cũng rất ngon. Đậm đà.', 8, 10, '2025-10-08 17:50:00', '2025-10-08 17:50:00', 78, 4),
(4, 'Mật ong có vẻ nguyên chất, vị ngọt thanh.', 9, 6, '2025-10-08 19:00:00', '2025-10-08 19:00:00', 65, 3),
(4, 'Shop đóng gói bánh pía cẩn thận, không bị vỡ.', 1, 7, '2025-10-09 09:20:00', '2025-10-09 09:20:00', 68, 2),
(4, 'Thịt bò một nắng ngon, nhưng giá hơi cao.', 2, 1, '2025-10-09 10:40:00', '2025-10-09 10:40:00', 72, 9),
(5, 'Cà phê này đúng gu của mình, thơm và không bị chua.', 3, 9, '2025-10-09 11:50:00', '2025-10-09 11:50:00', 84, 2),
(5, 'Chả ốc tuyệt vời, gia đình mình ai cũng thích.', 4, 10, '2025-10-09 13:10:00', '2025-10-09 13:10:00', 94, 1),
(3, 'Dê chiên nhiều dầu mỡ quá, ăn hơi ngán.', 5, 8, '2025-10-09 14:30:00', '2025-10-09 14:30:00', 41, 10),
(4, 'Gân bò ăn sần sật, nhưng cần giảm mặn đi một chút là hoàn hảo.', 6, 2, '2025-10-09 15:45:00', '2025-10-09 15:45:00', 53, 5),
(5, 'Hạt điều không bị hôi dầu, ăn rất thơm.', 7, 10, '2025-10-09 17:00:00', '2025-10-09 17:00:00', 89, 0),
(5, 'Mắm tép chưng thịt này là chân ái của những ngày lười nấu cơm.', 8, 7, '2025-10-09 18:15:00', '2025-10-09 18:15:00', 87, 2),
(4, 'Mật ong tốt, nhưng giao hàng hơi lâu.', 9, 3, '2025-10-09 19:30:00', '2025-10-09 19:30:00', 59, 4),
(5, 'Bánh pía ngon, nhân mềm, vỏ bánh nhiều lớp.', 1, 5, '2025-10-10 09:00:00', '2025-10-10 09:00:00', 81, 1),
-- Sửa lỗi: user_id=10 đã comment cho product_id=2. Đổi user_id thành 4.
(5, 'Bò một nắng tẩm ướp vừa miệng, nướng lên thơm lừng.', 2, 4, '2025-10-10 10:20:00', '2025-10-10 10:20:00', 91, 3),
(4, 'Cà phê chất lượng, sẽ tiếp tục ủng hộ.', 3, 4, '2025-10-10 11:35:00', '2025-10-10 11:35:00', 74, 3),
-- Sửa lỗi: user_id=1 đã comment cho product_id=4. Đổi user_id thành 3.
(5, 'Chả ốc giòn dai, không bị bở. Rất đáng tiền.', 4, 3, '2025-10-10 12:50:00', '2025-10-10 12:50:00', 96, 1),
(4, 'Dê chiên giòn rụm, giao đến vẫn còn nóng.', 5, 7, '2025-10-10 14:15:00', '2025-10-10 14:15:00', 70, 5),
(5, 'Hạt điều rang muối ngon, không có hạt nào bị mốc hay hỏng.', 7, 9, '2025-10-10 15:40:00', '2025-10-10 15:40:00', 92, 0),
(4, 'Mắm tép đóng hộp sạch sẽ, tiện lợi.', 8, 2, '2025-10-10 17:00:00', '2025-10-10 17:00:00', 80, 4),
(5, 'Mật ong nguyên chất, pha nước ấm uống buổi sáng rất tốt cho sức khỏe.', 9, 8, '2025-10-10 18:25:00', '2025-10-10 18:25:00', 86, 1),
-- Sửa lỗi: user_id=10 đã comment cho product_id=3. Đổi user_id thành 7.
(4, 'Cà phê có hậu vị ngọt, khá đặc biệt.', 3, 7, '2025-10-10 19:40:00', '2025-10-10 19:40:00', 69, 6);

-- CommentImages
INSERT INTO CommentImages (comment_id, image_url, created_at, updated_at) VALUES
-- Comment của user_id = 11 cho product_id = 1, 2, 3, 4 (giả sử comment_id là 1, 2, 3, 4)
(1, 'https://fakeimg.pl/250x250/?text=Image1', '2025-10-11 09:00:00', '2025-10-11 09:00:00'),
(1, 'https://fakeimg.pl/250x250/?text=Image2', '2025-10-11 09:05:00', '2025-10-11 09:05:00'),
(2, 'https://fakeimg.pl/250x250/?text=Image3', '2025-10-11 10:00:00', '2025-10-11 10:00:00'),
(2, 'https://fakeimg.pl/250x250/?text=Image4', '2025-10-11 10:05:00', '2025-10-11 10:05:00'),
(2, 'https://fakeimg.pl/250x250/?text=Image5', '2025-10-11 10:10:00', '2025-10-11 10:10:00'),
(3, 'https://fakeimg.pl/250x250/?text=Image6', '2025-10-11 11:00:00', '2025-10-11 11:00:00'),
(4, 'https://fakeimg.pl/250x250/?text=Image7', '2025-10-11 12:00:00', '2025-10-11 12:00:00'),
(4, 'https://fakeimg.pl/250x250/?text=Image8', '2025-10-11 12:05:00', '2025-10-11 12:05:00');

-- Dữ liệu mẫu bảng AIFeedback
INSERT INTO AIFeedback (product_id, voter_id, vote, created_at, updated_at) VALUES
(5, 1, 1, '2025-11-04 20:00:00', '2025-11-04 20:00:00'),
(12, 2, 0, '2025-11-04 20:01:00', '2025-11-04 20:01:00'),
(7, NULL, 1, '2025-11-04 20:02:00', '2025-11-04 20:02:00'),
(23, 3, 1, '2025-11-04 20:03:00', '2025-11-04 20:03:00'),
(15, 4, 0, '2025-11-04 20:04:00', '2025-11-04 20:04:00'),
(42, NULL, 0, '2025-11-04 20:05:00', '2025-11-04 20:05:00'),
(33, 5, 1, '2025-11-04 20:06:00', '2025-11-04 20:06:00'),
(56, 6, 1, '2025-11-04 20:07:00', '2025-11-04 20:07:00'),
(11, NULL, 0, '2025-11-04 20:08:00', '2025-11-04 20:08:00'),
(8, 7, 1, '2025-11-04 20:09:00', '2025-11-04 20:09:00'),
(19, 8, 0, '2025-11-04 20:10:00', '2025-11-04 20:10:00'),
(60, NULL, 1, '2025-11-04 20:11:00', '2025-11-04 20:11:00'),
(27, 9, 1, '2025-11-04 20:12:00', '2025-11-04 20:12:00'),
(34, 10, 0, '2025-11-04 20:13:00', '2025-11-04 20:13:00'),
(48, NULL, 1, '2025-11-04 20:14:00', '2025-11-04 20:14:00'),
(2, 11, 0, '2025-11-04 20:15:00', '2025-11-04 20:15:00'),
(76, NULL, 1, '2025-11-04 20:16:00', '2025-11-04 20:16:00'),
(89, 1, 0, '2025-11-04 20:17:00', '2025-11-04 20:17:00'),
(95, NULL, 1, '2025-11-04 20:18:00', '2025-11-04 20:18:00'),
(100, 2, 1, '2025-11-04 20:19:00', '2025-11-04 20:19:00');

-- Dữ liệu mẫu cho bảng CommentReactions
INSERT INTO 
    CommentReactions (user_id, product_id, comment_id, reaction, created_at) 
VALUES
    -- Reactions cho comment có id=10 (product_id=10, của user_id=5)
    (1, 10, 10, 'like', '2025-09-27 18:00:00'),
    (2, 10, 10, 'like', '2025-09-27 18:05:00'),
    (4, 10, 10, 'like', '2025-09-27 19:10:00'),
    (8, 10, 10, 'dislike', '2025-09-28 09:00:00'),
    -- Reactions cho comment có id=26 (product_id=10, của user_id=3)
    (2, 10, 26, 'like', '2025-10-05 09:30:15'),
    (5, 10, 26, 'like', '2025-10-05 10:00:00'),
    (9, 10, 26, 'like', '2025-10-05 11:00:00'),
    -- Reactions cho comment có id=27 (product_id=10, của user_id=7) - comment này chê dính răng
    (1, 10, 27, 'like', '2025-10-05 11:30:00'),  -- User 1 đồng ý là 'ăn cũng được'
    (6, 10, 27, 'dislike', '2025-10-05 12:00:00'), -- User 6 không thích vì dính răng
    (8, 10, 27, 'dislike', '2025-10-05 12:05:20'),
    -- Reactions cho comment có id=28 (product_id=10, của user_id=10) - comment rất tích cực
    (1, 10, 28, 'like', '2025-10-05 14:05:00'),
    (2, 10, 28, 'like', '2025-10-05 14:10:00'),
    (3, 10, 28, 'like', '2025-10-05 14:12:00'),
    (4, 10, 28, 'like', '2025-10-05 15:00:00'),
    (6, 10, 28, 'like', '2025-10-05 15:30:00'),
    (7, 10, 28, 'like', '2025-10-05 16:00:00'),
    -- Reactions cho comment có id=29 (product_id=10, của user_id=1) - comment chê ngọt
    (4, 10, 29, 'dislike', '2025-10-05 17:00:00'), -- User 4 cũng thấy ngọt
    (5, 10, 29, 'dislike', '2025-10-05 17:30:00'),
    (7, 10, 29, 'like', '2025-10-05 18:00:00'),   -- User 7 lại thích vị ngọt này
    -- Reactions cho comment có id=30 (product_id=10, của user_id=9)
    (3, 10, 30, 'like', '2025-10-05 18:30:00'),
    (5, 10, 30, 'like', '2025-10-05 18:35:10'),
    (10, 10, 30, 'like', '2025-10-05 19:00:00'),
    -- Thêm một vài reactions cho các comment của sản phẩm khác để dữ liệu đa dạng hơn
    -- Reactions cho comment có id=1 (product_id=1) - comment rất tích cực
    (3, 1, 1, 'like', '2025-09-20 11:00:00'),
    (6, 1, 1, 'like', '2025-09-20 11:30:00'),
    (7, 1, 1, 'like', '2025-09-20 12:00:00'),
    (9, 1, 1, 'like', '2025-09-20 14:00:00'),
    -- Reactions cho comment có id=6 (product_id=6) - comment chê mặn
    (2, 6, 6, 'dislike', '2025-09-25 11:20:00'), -- User 2 không đồng tình
    (4, 6, 6, 'like', '2025-09-25 11:25:00'),   -- User 4 lại thấy ngon
    (5, 6, 6, 'dislike', '2025-09-25 12:00:00'),
    -- Reactions cho comment có id=51 (product_id=2) - comment chê dai và mặn
    (1, 2, 51, 'dislike', '2025-10-07 11:00:00'),
    (4, 2, 51, 'dislike', '2025-10-07 11:05:00'),
    (6, 2, 51, 'dislike', '2025-10-07 11:15:00'),
    (8, 2, 51, 'like', '2025-10-07 12:00:00'); -- User 8 lại không thấy vậy

-- Dữ liệu mẫu cho Payments
INSERT INTO Payments (method, status, icon_url) VALUES
('COD', 1, 'https://cdn-icons-png.flaticon.com/512/3796/3796142.png'),
('CreditCard', 1, 'https://cdn-icons-png.flaticon.com/512/6963/6963703.png'),
('Momo', 0, 'https://img.mservice.com.vn/app/img/portal_documents/mini-app_design-guideline_branding-guide-2-2.png'),
('VNPay', 1, 'https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg'),
('ZaloPay', 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s'),
('Paypal', 0, 'https://png.pngtree.com/element_our/png/20180723/paypal-logo-icon-png_44635.jpg');

-- Dữ liệu mẫu cho Shipments
INSERT INTO Shipments (name, description, base_fee, icon_url, status) VALUES
('GHN', 'Giao Hàng Nhanh, giao trong 1-2 ngày nội thành', 20000, 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En.png', 1),
('GHTK', 'Giao Hàng Tiết Kiệm, chi phí thấp, giao trong 2-3 ngày', 15000, 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-V.png', 1),
('Viettel Post', 'Viettel Post, giao hàng toàn quốc', 25000, 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Viettel-Post-Transparent.png', 1),
('J&T Express', 'Giao hàng nhanh, phù hợp nội thành và ngoại thành', 22000, 'https://i.pinimg.com/474x/29/4d/14/294d1488cebbfd40db530843c96dc68e.jpg', 1);

-- Dữ liệu mẫu cho Transactions
INSERT INTO Transactions
(status, deli_name, deli_phone, deli_email, deli_address, deli_city, deli_district, deli_ward, message, tracking_number, shipping_fee, shipment_status, amount, shipped_at, delivered_at, user_id, payment_id, shipment_id, created_at, updated_at) VALUES
('pending', 'Nguyen Van A', '0901234567', 'a.nguyen@example.com', '123 Le Loi', 'Ho Chi Minh', 'Quan 1', 'Phuong Ben Nghe', 'Giao giờ hành chính', 'TRK00001', 20000, 'pending', 1020000, NULL, NULL, 1, 1, 1, '2025-12-27 09:15:00', '2025-12-28 10:20:00'),
('confirmed', 'Tran Thi B', '0902345678', 'b.tran@example.com', '456 Nguyen Trai', 'Ho Chi Minh', 'Quan 3', 'Phuong 5', 'Để hàng ở bảo vệ', 'TRK00002', 15000, 'shipped', 515000, '2025-09-22 10:00:00', NULL, 2, 2, 2, '2025-12-26 08:00:00', '2025-12-27 09:50:00'),
('completed', 'Le Van C', '0903456789', 'c.le@example.com', '789 Tran Hung Dao', 'Ho Chi Minh', 'Quan 5', 'Phuong 10', 'Giao nhanh nếu có thể', 'TRK00003', 22000, 'delivered', 220000, '2025-09-23 09:00:00', '2025-09-24 14:00:00', 3, 3, 3, '2025-12-26 11:30:00', '2025-12-28 14:00:00'),
('canceled', 'Pham Thi D', '0904567890', NULL, '1010 Cach Mang Thang 8', 'Ho Chi Minh', 'Quan Binh Thanh', 'Phuong 12', 'Không cần gọi điện', 'TRK00004', 25000, 'returned', 700000, '2025-09-24 11:00:00', NULL, 4, 4, 4, '2025-12-27 12:00:00', '2025-12-28 09:50:00'),
('completed', 'Hoang Van E', '0905678901', 'e.hoang@example.com', '2020 Dien Bien Phu', 'Ho Chi Minh', 'Quan Tan Binh', 'Phuong 15', 'Giao ngoài giờ hành chính', 'TRK00005', 30000, 'delivered', 28030000, '2025-09-25 13:00:00', '2025-09-26 16:00:00', 5, 5, 1, '2025-12-26 14:00:00', '2025-12-28 16:20:00'),
('confirmed', 'Nguyen Van A', '0901234567', NULL, '123 Le Loi', 'Ho Chi Minh', 'Quan 1', 'Phuong Ben Nghe', 'Đóng gói cẩn thận', 'TRK00006', 15000, 'shipped', 11015000, '2025-09-26 08:00:00', NULL, 1, 2, 2, '2025-12-26 09:15:00', '2025-12-27 07:50:00'),
('pending', 'Tran Thi B', '0902345678', 'b.tran@example.com', '456 Nguyen Trai', 'Ho Chi Minh', 'Quan 3', 'Phuong 5', 'Giao tại cửa', 'TRK00007', 20000, 'pending', 1202000, NULL, NULL, 2, 1, 3, '2025-12-28 10:00:00', '2025-12-28 10:00:00'),
('completed', 'Le Van C', '0903456789', NULL, '789 Tran Hung Dao', 'Ho Chi Minh', 'Quan 5', 'Phuong 10', 'Nhận hàng tại văn phòng', 'TRK00008', 25000, 'delivered', 64525000, '2025-09-22 14:00:00', '2025-09-23 17:00:00', 3, 3, 4, '2025-12-27 13:00:00', '2025-12-28 16:50:00'),
('confirmed', 'Pham Thi D', '0904567890', 'd.pham@example.com', '1010 Cach Mang Thang 8', 'Ho Chi Minh', 'Quan Binh Thanh', 'Phuong 12', 'Giao vào buổi sáng', 'TRK00009', 22000, 'shipped', 4202200, '2025-09-25 09:30:00', NULL, 4, 2, 1, '2025-12-26 08:30:00', '2025-12-28 09:20:00'),
('completed', 'Hoang Van E', '0905678901', 'e.hoang@example.com', '2020 Dien Bien Phu', 'Ho Chi Minh', 'Quan Tan Binh', 'Phuong 15', 'Hàng fragile, cẩn thận', 'TRK00010', 30000, 'delivered', 7503000, '2025-09-24 13:00:00', '2025-09-25 15:00:00', 5, 5, 2, '2025-12-27 12:30:00', '2025-12-28 14:50:00');

-- Dữ liệu mẫu cho OrderItems
INSERT INTO OrderItems (qty_total, amount_total, transaction_id, product_id) VALUES
(1, 33000000, 1, 1),
(2, 29500000, 2, 2),
(1, 21500000, 3, 3),
(1, 5500000, 4, 6),
(1, 28000000, 5, 7),
(3, 11000000, 6, 5),
(2, 1200000, 7, 9),
(1, 64500000, 8, 4),
(1, 4200000, 9, 8),
(2, 7500000, 10, 10);