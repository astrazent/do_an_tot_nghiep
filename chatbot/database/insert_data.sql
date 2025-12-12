-- Dữ liệu mẫu cho Datasources
INSERT INTO DataSources (name, slug, description)
VALUES
('Thông tin doanh nghiệp', 'business-info', 'Chứa toàn bộ nội dung liên quan đến thông tin doanh nghiệp, bao gồm: tuyển đại lý, liên hệ, địa chỉ,...'),
('Thông tin mua hàng', 'purchase-info', 'Chứa toàn bộ nội dung liên quan đến thông tin đơn hàng, bao gồm: sản phẩm, thể loại, phương thức thanh toán,...');

-- Dữ liệu mẫu cho Documents
INSERT INTO Documents (file_name, datasource_id, description, source_type, is_active, doc_owner)
VALUES
('tuyen_dai_ly.txt', 1, 'Chính sách tuyển đại lý', 'txt', TRUE, 'user'),
('gioi_thieu.pdf', 1, 'Giới thiệu doanh nghiệp', 'pdf', TRUE, 'user'),
('lien_he.txt', 1, 'Thông tin liên hệ', 'txt', TRUE, 'user'),
('shipments.json', 2, 'Danh sách các phương thức vận chuyển', 'json', TRUE, 'system'),
('payments.json', 2, 'Danh sách các phương thức thanh toán', 'json', TRUE, 'system'),
('products.json', 2, 'Danh sách thông tin sản phẩm', 'json', TRUE, 'system');

-- Dữ liệu mẫu cho Conversations Bếp Sạch Việt
INSERT INTO Conversations (user_id, title, status, start_time, last_message_time, end_time)
VALUES
(11, 'Tư vấn thực đơn hôm nay', 'active', NOW(), NULL, NULL),
(11, 'Tra cứu lịch giao hàng', 'ended', '2025-11-25 10:00:00', '2025-11-25 10:15:00', '2025-11-25 10:15:00'),
(11, 'Hỏi về nguồn gốc nguyên liệu', 'active', NOW(), NULL, NULL),
(11, 'Đặt món trực tuyến', 'ended', '2025-11-20 14:30:00', '2025-11-20 14:50:00', '2025-11-20 14:50:00');

-- Dữ liệu mẫu cho Messages Bếp Sạch Việt
INSERT INTO Messages (conversation_id, sender, content, created_at)
VALUES
-- Conversation 1: Tư vấn thực đơn hôm nay
(1, 'user', 'Xin chào, tôi muốn hỏi về thực đơn hôm nay.', NOW()),
(1, 'bot', 'Chào bạn! Hôm nay chúng tôi có đặc sản gà nướng Hòa Bình, cá kho Hà Nội và salad trộn.', NOW()),
(1, 'user', 'Tôi muốn gọi món gà nướng và salad.', NOW()),
(1, 'bot', 'Bạn có muốn thêm nước uống kèm không?', NOW()),

-- Conversation 2: Tra cứu lịch giao hàng
(2, 'user', 'Cho tôi biết lịch giao hàng tuần này.', '2025-11-25 10:05:00'),
(2, 'bot', 'Tuần này đơn hàng sẽ được giao vào Thứ 2, Thứ 4 và Thứ 6.', '2025-11-25 10:10:00'),
(2, 'user', 'Cảm ơn!', '2025-11-25 10:12:00'),
(2, 'bot', 'Không có gì! Chúc bạn ngon miệng.', '2025-11-25 10:15:00'),

-- Conversation 3: Hỏi về nguồn gốc nguyên liệu
(3, 'user', 'Tôi muốn biết nguồn gốc rau củ và thịt.', NOW()),
(3, 'bot', 'Tất cả nguyên liệu đều từ các trang trại hữu cơ vùng miền, đảm bảo sạch và tươi ngon.', NOW()),

-- Conversation 4: Đặt món trực tuyến
(4, 'user', 'Tôi muốn đặt 2 phần cơm gà vùng Bắc.', '2025-11-20 14:35:00'),
(4, 'bot', 'Cơm gà vùng Bắc hiện còn sẵn. Bạn muốn giao lúc mấy giờ?', '2025-11-20 14:40:00'),
(4, 'user', 'Giao lúc 18h hôm nay.', '2025-11-20 14:45:00'),
(4, 'bot', 'Đơn hàng của bạn đã được xác nhận và sẽ giao đúng giờ.', '2025-11-20 14:50:00');