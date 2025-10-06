DROP TABLE IF EXISTS Boards;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Shipments;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS ProductImages;
DROP TABLE IF EXISTS Sliders;
DROP TABLE IF EXISTS DiscountProducts;
DROP TABLE IF EXISTS Discounts;
DROP TABLE IF EXISTS CartItems;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS PostCategories;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Roles;

-- Roles (giữ nguyên)
CREATE TABLE
    Roles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Roles (name, description) VALUES
('admin', 'Quyền quản trị hệ thống, có thể thêm, sửa, xóa dữ liệu và quản lý user'),
('user', 'Quyền người dùng bình thường, chỉ có thể xem và thao tác hạn chế trong hệ thống');

-- Admins
CREATE TABLE
    Admins (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        level TINYINT (2) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        description VARCHAR(255),
        role_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_admins_role FOREIGN KEY (role_id) REFERENCES Roles (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Admins (username, email, full_name, password_hash, level, description, role_id) VALUES
('superadmin', 'superadmin@example.com', 'Nguyen Van A', '$2y$10$examplehash1', 3, 'Quản trị viên cao cấp, toàn quyền trên hệ thống', 1),
('admin1', 'admin1@example.com', 'Tran Thi B', '$2y$10$examplehash2', 2, 'Quản lý nội dung và người dùng', 1),
('admin2', 'admin2@example.com', 'Le Van C', '$2y$10$examplehash3', 1, 'Hỗ trợ quản lý vận hành', 1),
('useradmin', 'useradmin@example.com', 'Pham Thi D', '$2y$10$examplehash4', 0, 'Admin cấp thấp, quyền hạn giới hạn', 1);

-- Posts
CREATE TABLE
    Posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        status TINYINT NOT NULL DEFAULT 1,
        published_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        admin_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_posts_admin FOREIGN KEY (admin_id) REFERENCES Admins (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Posts (title, content, author_name, description, status, published_at, admin_id) VALUES
('Hướng dẫn sử dụng hệ thống', '<p>Đây là hướng dẫn chi tiết cách sử dụng hệ thống.</p>', 'Nguyen Van A', 'Hướng dẫn sử dụng hệ thống cho người mới', 1, '2025-09-27 09:00:00', 1),
('Cập nhật tính năng mới', '<p>Chúng tôi vừa thêm tính năng mới: quản lý người dùng nâng cao.</p>', 'Tran Thi B', 'Thông báo cập nhật tính năng mới', 1, '2025-09-26 14:30:00', 2),
('Mẹo bảo mật tài khoản', '<p>Bảo mật tài khoản là rất quan trọng, hãy thường xuyên đổi mật khẩu.</p>', 'Le Van C', 'Mẹo và hướng dẫn bảo mật tài khoản', 1, '2025-09-25 10:15:00', 3),
('Thông báo bảo trì hệ thống', '<p>Hệ thống sẽ được bảo trì vào cuối tuần, mong mọi người lưu ý.</p>', 'Pham Thi D', 'Thông báo lịch bảo trì hệ thống', 0, NULL, 4);

-- Categories (self-relation)
CREATE TABLE
    Categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description varchar(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        parent_id INT UNSIGNED NULL,
        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES Categories (id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_categories_parent (parent_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Categories (name, description, parent_id) VALUES
('Đặc sản Việt Nam', 'Các đặc sản nổi tiếng từ nhiều vùng miền Việt Nam', NULL),
('Miền Bắc', 'Đặc sản vùng Bắc Bộ', 1),
('Miền Trung', 'Đặc sản vùng Trung Bộ', 1),
('Miền Nam', 'Đặc sản vùng Nam Bộ', 1),
('Hải sản', 'Các loại hải sản tươi sống và chế biến', NULL),
('Cá biển', 'Cá biển và các sản phẩm từ cá', 5),
('Tôm, cua, ghẹ', 'Tôm, cua, ghẹ từ các vùng biển', 5),
('Nguyên liệu địa phương', 'Nguyên liệu, gia vị đặc trưng vùng miền', NULL),
('Trái cây', 'Trái cây đặc sản theo mùa và vùng miền', 8),
('Món ăn khô', 'Các loại mứt, bánh kẹo, lương khô đặc sản', 8);

-- PostCategories
CREATE TABLE
    PostCategories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        category_id INT UNSIGNED NOT NULL,
        post_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_postcategories_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_postcategories_post FOREIGN KEY (post_id) REFERENCES Posts (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO PostCategories (category_id, post_id) VALUES
(1, 1),  -- 'Hướng dẫn sử dụng hệ thống' thuộc 'Đặc sản Việt Nam'
(2, 1),  -- cùng bài post thuộc 'Miền Bắc'
(1, 2),  -- 'Cập nhật tính năng mới' thuộc 'Đặc sản Việt Nam'
(3, 2),  -- cùng bài post thuộc 'Miền Trung'
(4, 3),  -- 'Mẹo bảo mật tài khoản' thuộc 'Miền Nam'
(8, 3),  -- cùng bài post thuộc 'Nguyên liệu địa phương'
(9, 4);  -- 'Thông báo bảo trì hệ thống' thuộc 'Trái cây' (giả lập)

-- Users
CREATE TABLE 
    Users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    token VARCHAR(512) UNIQUE DEFAULT NULL,
    token_started_at DATETIME DEFAULT NULL,
    token_expired_at DATETIME DEFAULT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Users (username, password_hash, email, phone, full_name, address, city, district, ward, avatar_url, status, token_started_at, token_expired_at) VALUES
('nguyen123', MD5('123456'), 'nguyen123@example.com', '0901234567', 'Nguyen Van A', '123 Le Loi', 'Ho Chi Minh', 'Quan 1', 'Phuong Ben Nghe', 'https://i.pravatar.cc/150?img=1', 1, '2025-01-01 00:00:00', '2026-01-01 00:00:00'),
('tranthi456', MD5('abcdef'), 'tranthi456@example.com', '0902345678', 'Tran Thi B', '456 Nguyen Trai', 'Ho Chi Minh', 'Quan 3', 'Phuong 5', 'https://i.pravatar.cc/150?img=2', 1, '2025-02-01 00:00:00', '2026-02-01 00:00:00'),
('levan789', MD5('password'), 'le.van789@example.com', '0903456789', 'Le Van C', '789 Tran Hung Dao', 'Ho Chi Minh', 'Quan 5', 'Phuong 10', 'https://i.pravatar.cc/150?img=3', 0, '2025-03-01 00:00:00', '2025-09-01 00:00:00'),
('phamthi001', MD5('qwerty'), 'phamthi001@example.com', '0904567890', 'Pham Thi D', '1010 Cach Mang Thang 8', 'Ho Chi Minh', 'Quan Binh Thanh', 'Phuong 12', 'https://i.pravatar.cc/150?img=4', 1, '2025-04-01 00:00:00', '2026-04-01 00:00:00'),
('hoangvan002', MD5('letmein'), 'hoangvan002@example.com', '0905678901', 'Hoang Van E', '2020 Dien Bien Phu', 'Ho Chi Minh', 'Quan Tan Binh', 'Phuong 15', 'https://i.pravatar.cc/150?img=5', 0, '2025-05-01 00:00:00', '2025-12-01 00:00:00');

-- Products
CREATE TABLE
    Products (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(255),
        origin_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        buyed INT UNSIGNED NOT NULL DEFAULT 0,
        rate_point_total INT UNSIGNED NOT NULL DEFAULT 0,
        rate_count INT UNSIGNED NOT NULL DEFAULT 0,
        stock_qty INT UNSIGNED NOT NULL DEFAULT 0,
        low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 0,
        last_restock_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        category_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_products_category (category_id),
        INDEX idx_products_name (name)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Products (name, description, origin_price, price, buyed, rate_point_total, rate_count, stock_qty, low_stock_threshold, last_restock_at, status, category_id) VALUES
('Phở Hà Nội', 'Món phở truyền thống đặc trưng vùng Bắc Bộ', 50000, 45000, 120, 580, 120, 200, 10, '2025-09-20 10:00:00', 1, 2),
('Bánh cuốn Thanh Trì', 'Bánh cuốn nóng, nổi tiếng ở Hà Nội', 40000, 38000, 80, 380, 80, 150, 5, '2025-09-18 12:00:00', 1, 2),
('Bánh bèo Huế', 'Bánh bèo truyền thống vùng Trung Bộ', 30000, 28000, 60, 290, 60, 100, 5, '2025-09-22 15:00:00', 1, 3),
('Mắm nêm Phú Quốc', 'Mắm nêm nổi tiếng từ đảo Phú Quốc', 120000, 110000, 40, 180, 40, 50, 5, '2025-09-21 09:00:00', 1, 3),
('Rượu Bàu Đá', 'Rượu đặc sản vùng Quảng Ngãi', 250000, 230000, 25, 120, 25, 30, 5, '2025-09-19 14:00:00', 1, 4),
('Nem chua Thanh Hóa', 'Nem chua chuẩn vị Thanh Hóa', 80000, 75000, 100, 450, 100, 80, 10, '2025-09-15 10:30:00', 1, 6),
('Bánh tráng Tây Ninh', 'Bánh tráng cuốn thịt heo đặc sản Tây Ninh', 90000, 85000, 50, 240, 50, 60, 5, '2025-09-16 11:00:00', 1, 7),
('Trái cây sấy Đà Lạt', 'Trái cây sấy khô từ Đà Lạt', 120000, 110000, 200, 900, 200, 100, 10, '2025-09-10 08:00:00', 1, 9),
('Mật ong rừng Tây Nguyên', 'Mật ong nguyên chất, thu hoạch tự nhiên', 250000, 230000, 150, 700, 150, 80, 5, '2025-09-12 09:30:00', 1, 10),
('Bánh pía Sóc Trăng', 'Bánh pía truyền thống Sóc Trăng, nhân đậu xanh', 70000, 65000, 75, 350, 75, 50, 5, '2025-09-14 13:00:00', 1, 6);

-- CartItems
CREATE TABLE
    CartItems (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        qty_total INT UNSIGNED NOT NULL,
        price_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_cartitems_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_cartitems_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO CartItems (qty_total, price_total, user_id, product_id) VALUES
(1, 45000, 1, 1),    -- User 1 mua 1 Phở Hà Nội
(2, 56000, 1, 2),    -- User 1 mua 2 Bánh cuốn Thanh Trì
(1, 28000, 2, 3),    -- User 2 mua 1 Bánh bèo Huế
(3, 330000, 3, 4),   -- User 3 mua 3 Mắm nêm Phú Quốc
(5, 375000, 4, 6),   -- User 4 mua 5 Nem chua Thanh Hóa
(2, 170000, 4, 7),   -- User 4 mua 2 Bánh tráng Tây Ninh
(10, 1100000, 5, 8), -- User 5 mua 10 Trái cây sấy Đà Lạt
(3, 690000, 5, 9),   -- User 5 mua 3 Mật ong rừng Tây Nguyên
(2, 130000, 2, 10);  -- User 2 mua 2 Bánh pía Sóc Trăng

-- Discounts
CREATE TABLE
    Discounts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        min_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status TINYINT (1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Discounts (name, description, value, min_price, start_date, end_date, status) VALUES
('Giảm 10% mùa hè', 'Áp dụng cho tất cả đặc sản mùa hè', 10, 100000, '2025-06-01 00:00:00', '2025-08-31 23:59:59', 1),
('Flash Sale 50k', 'Giảm trực tiếp 50.000 VND cho đơn hàng đặc sản từ 500.000 VND', 50000, 500000, '2025-09-20 00:00:00', '2025-09-25 23:59:59', 1),
('Mua 1 tặng 1', 'Chương trình mua 1 tặng 1 cho một số đặc sản chọn lọc', 100, 0, '2025-10-01 00:00:00', '2025-10-10 23:59:59', 0),
('Giảm 20% dịp lễ', 'Khuyến mại 20% tất cả đặc sản dịp lễ', 20, 200000, '2025-12-20 00:00:00', '2025-12-31 23:59:59', 1),
('Free Ship 0đ', 'Miễn phí vận chuyển cho đơn hàng đặc sản trên 300.000 VND', 0, 300000, '2025-09-01 00:00:00', '2025-09-30 23:59:59', 1);

-- DiscountProducts
CREATE TABLE
    DiscountProducts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        discount_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_discountproducts_discount FOREIGN KEY (discount_id) REFERENCES Discounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_discountproducts_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO DiscountProducts (discount_id, product_id) VALUES
(1, 1),  -- Giảm 10% mùa hè áp dụng cho Phở Hà Nội
(1, 2),  -- Giảm 10% mùa hè áp dụng cho Bánh cuốn Thanh Trì
(2, 3),  -- Flash Sale 50k áp dụng cho Bánh bèo Huế
(2, 4),  -- Flash Sale 50k áp dụng cho Mắm nêm Phú Quốc
(3, 5),  -- Mua 1 tặng 1 áp dụng cho Chả cá Lã Vọng
(4, 6),  -- Giảm 20% dịp lễ áp dụng cho Nem chua Thanh Hóa
(4, 7),  -- Giảm 20% dịp lễ áp dụng cho Bánh tráng Tây Ninh
(5, 8),  -- Free Ship 0đ áp dụng cho Trái cây sấy Đà Lạt
(5, 9),  -- Free Ship 0đ áp dụng cho Mật ong rừng Tây Nguyên
(5, 10); -- Free Ship 0đ áp dụng cho Bánh pía Sóc Trăng

-- Sliders
CREATE TABLE
    Sliders (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        sort_order INT (11) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Sliders (name, image_url, sort_order) VALUES
('Khuyến mãi mùa hè', 'https://via.placeholder.com/800x300?text=Summer+Sale', 1),
('Đặc sản bán chạy', 'https://via.placeholder.com/800x300?text=Best+Sellers', 2),
('Mới ra mắt', 'https://via.placeholder.com/800x300?text=New+Arrivals', 3),
('Ưu đãi cuối tuần', 'https://via.placeholder.com/800x300?text=Weekend+Deals', 4),
('Sản phẩm nổi bật', 'https://via.placeholder.com/800x300?text=Featured+Products', 5);

-- ProductImages
CREATE TABLE
    ProductImages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        is_main TINYINT (1) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        product_id INT UNSIGNED NOT NULL,
        slider_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_productimages_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_productimages_slider FOREIGN KEY (slider_id) REFERENCES Sliders (id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_productimages_product (product_id),
        INDEX idx_productimages_slider (slider_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO ProductImages (is_main, image_url, product_id, slider_id) VALUES
(1, 'https://via.placeholder.com/400x400?text=Phở+Hà+Nội', 1, 1),
(0, 'https://via.placeholder.com/400x400?text=Phở+Hà+Nội+Alt', 1, 1),
(1, 'https://via.placeholder.com/400x400?text=Bánh+cuốn+Thanh+Trì', 2, 1),
(0, 'https://via.placeholder.com/400x400?text=Bánh+cuốn+Thanh+Trì+Alt', 2, 3),
(1, 'https://via.placeholder.com/400x400?text=Bánh+bèo+Huế', 3, 2),
(1, 'https://via.placeholder.com/400x400?text=Mắm+nêm+Phú+Quốc', 4, 2),
(1, 'https://via.placeholder.com/400x400?text=Chả+cá+Lã+Vọng', 5, 3),
(1, 'https://via.placeholder.com/400x400?text=Nem+chua+Thanh+Hóa', 6, 4),
(0, 'https://via.placeholder.com/400x400?text=Nem+chua+Thanh+Hóa+Alt', 6, 4),
(1, 'https://via.placeholder.com/400x400?text=Bánh+tráng+Tây+Ninh', 7, 4),
(1, 'https://via.placeholder.com/400x400?text=Trái+cây+sấy+Đà+Lạt', 8, 5),
(1, 'https://via.placeholder.com/400x400?text=Mật+ong+rừng+Tây+Nguyên', 9, 5),
(1, 'https://via.placeholder.com/400x400?text=Bánh+pía+Sóc+Trăng', 10, 4);

-- Comments
CREATE TABLE
    Comments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        rate TINYINT (1) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        product_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Comments (rate, content, product_id, user_id, created_at, updated_at) VALUES
(5, 'Phở Hà Nội ngon tuyệt, nước dùng đậm đà!', 1, 1, '2025-09-20 10:15:00', '2025-09-20 10:15:00'),
(4, 'Bánh cuốn Thanh Trì mềm và thơm, rất hợp khẩu vị.', 2, 2, '2025-09-21 12:30:00', '2025-09-21 12:30:00'),
(3, 'Bánh bèo Huế ổn, nhưng hơi nhạt.', 3, 3, '2025-09-22 14:00:00', '2025-09-22 14:00:00'),
(5, 'Mắm nêm Phú Quốc đậm vị, rất ngon!', 4, 4, '2025-09-23 16:45:00', '2025-09-23 16:45:00'),
(4, 'Chả cá Lã Vọng thơm, ăn khá ổn.', 5, 5, '2025-09-24 09:20:00', '2025-09-24 09:20:00'),
(2, 'Nem chua Thanh Hóa hơi mặn so với mong đợi.', 6, 1, '2025-09-25 11:10:00', '2025-09-25 11:10:00'),
(5, 'Bánh tráng Tây Ninh giòn, ăn cực đã.', 7, 2, '2025-09-26 13:35:00', '2025-09-26 13:35:00'),
(4, 'Trái cây sấy Đà Lạt thơm và ngọt.', 8, 3, '2025-09-27 15:00:00', '2025-09-27 15:00:00'),
(3, 'Mật ong rừng Tây Nguyên hơi đặc, vẫn ok.', 9, 4, '2025-09-27 16:20:00', '2025-09-27 16:20:00'),
(5, 'Bánh pía Sóc Trăng ngon, lớp nhân thơm béo.', 10, 5, '2025-09-27 17:45:00', '2025-09-27 17:45:00');

-- Payments
CREATE TABLE
    Payments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        method VARCHAR(50) NOT NULL, -- COD, CreditCard, Momo, VNPay, ...
        status TINYINT (1) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payments_method (method),
        INDEX idx_payments_status (status)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Payments (method, status) VALUES
('COD', 1),
('CreditCard', 1),
('Momo', 1),
('VNPay', 0),
('ZaloPay', 1),
('Paypal', 0);

-- Shipments
CREATE TABLE
    Shipments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL, -- Tên phương thức: GHN, GHTK, Viettel Post...
        description VARCHAR(255), -- Mô tả thêm
        base_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- Phí cơ bản
        status TINYINT (1) NOT NULL DEFAULT 1, -- 1: hoạt động, 0: ngừng
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Shipments (name, description, base_fee, status) VALUES
('GHN', 'Giao Hàng Nhanh, giao trong 1-2 ngày nội thành', 20000, 1),
('GHTK', 'Giao Hàng Tiết Kiệm, chi phí thấp, giao trong 2-3 ngày', 15000, 1),
('Viettel Post', 'Viettel Post, giao hàng toàn quốc', 25000, 1),
('J&T Express', 'Giao hàng nhanh, phù hợp nội thành và ngoại thành', 22000, 1),
('Ninja Van', 'Dịch vụ vận chuyển quốc tế và nội địa', 30000, 0);

-- Transactions
CREATE TABLE
    Transactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        status TINYINT (1) NOT NULL, -- trạng thái đơn hàng (0: pending, 1: confirmed, 2: completed, ...)
        deli_name VARCHAR(100) NOT NULL, -- tên người nhận
        deli_phone VARCHAR(20) NOT NULL, -- số điện thoại người nhận
        deli_address VARCHAR(255) NOT NULL, -- địa chỉ giao hàng chi tiết
        deli_city VARCHAR(100) NOT NULL,
        deli_district VARCHAR(100) NOT NULL,
        deli_ward VARCHAR(100) NOT NULL,
        message VARCHAR(255) NOT NULL, -- ghi chú của khách hàng
        tracking_number VARCHAR(100) NOT NULL, -- mã vận đơn
        shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- phí vận chuyển
        shipment_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, shipped, in_transit, delivered, returned
        amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- tổng tiền đơn hàng
        shipped_at DATETIME NULL, -- ngày gửi
        delivered_at DATETIME NULL, -- ngày giao
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id INT UNSIGNED NOT NULL,
        payment_id INT UNSIGNED NOT NULL,
        shipment_id INT UNSIGNED NOT NULL, -- liên kết phương thức vận chuyển
        CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id) REFERENCES Payments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_transactions_shipment FOREIGN KEY (shipment_id) REFERENCES Shipments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_transactions_status (status),
        INDEX idx_transactions_tracking (tracking_number),
        INDEX idx_transactions_shipment_status (shipment_status),
        INDEX idx_transactions_shipment (shipment_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Transactions 
(status, deli_name, deli_phone, deli_address, deli_city, deli_district, deli_ward, message, tracking_number, shipping_fee, shipment_status, amount, shipped_at, delivered_at, user_id, payment_id, shipment_id) VALUES
(0, 'Nguyen Van A', '0901234567', '123 Le Loi', 'Ho Chi Minh', 'Quan 1', 'Phuong Ben Nghe', 'Giao giờ hành chính', 'TRK00001', 20000, 'pending', 33020000, NULL, NULL, 1, 1, 1),
(1, 'Tran Thi B', '0902345678', '456 Nguyen Trai', 'Ho Chi Minh', 'Quan 3', 'Phuong 5', 'Để hàng ở bảo vệ', 'TRK00002', 15000, 'shipped', 29515000, '2025-09-22 10:00:00', NULL, 2, 2, 2),
(4, 'Le Van C', '0903456789', '789 Tran Hung Dao', 'Ho Chi Minh', 'Quan 5', 'Phuong 10', 'Giao nhanh nếu có thể', 'TRK00003', 22000, 'delivered', 21522000, '2025-09-23 09:00:00', '2025-09-24 14:00:00', 3, 3, 3),
(2, 'Pham Thi D', '0904567890', '1010 Cach Mang Thang 8', 'Ho Chi Minh', 'Quan Binh Thanh', 'Phuong 12', 'Không cần gọi điện', 'TRK00004', 25000, 'returned', 5500000, '2025-09-24 11:00:00', NULL, 4, 4, 4),
(4, 'Hoang Van E', '0905678901', '2020 Dien Bien Phu', 'Ho Chi Minh', 'Quan Tan Binh', 'Phuong 15', 'Giao ngoài giờ hành chính', 'TRK00005', 30000, 'delivered', 28030000, '2025-09-25 13:00:00', '2025-09-26 16:00:00', 5, 5, 1),
(1, 'Nguyen Van A', '0901234567', '123 Le Loi', 'Ho Chi Minh', 'Quan 1', 'Phuong Ben Nghe', 'Đóng gói cẩn thận', 'TRK00006', 15000, 'shipped', 11015000, '2025-09-26 08:00:00', NULL, 1, 2, 2),
(0, 'Tran Thi B', '0902345678', '456 Nguyen Trai', 'Ho Chi Minh', 'Quan 3', 'Phuong 5', 'Giao tại cửa', 'TRK00007', 20000, 'pending', 1202000, NULL, NULL, 2, 1, 3),
(4, 'Le Van C', '0903456789', '789 Tran Hung Dao', 'Ho Chi Minh', 'Quan 5', 'Phuong 10', 'Nhận hàng tại văn phòng', 'TRK00008', 25000, 'delivered', 64525000, '2025-09-22 14:00:00', '2025-09-23 17:00:00', 3, 3, 4),
(1, 'Pham Thi D', '0904567890', '1010 Cach Mang Thang 8', 'Ho Chi Minh', 'Quan Binh Thanh', 'Phuong 12', 'Giao vào buổi sáng', 'TRK00009', 22000, 'shipped', 4202200, '2025-09-25 09:30:00', NULL, 4, 2, 5),
(4, 'Hoang Van E', '0905678901', '2020 Dien Bien Phu', 'Ho Chi Minh', 'Quan Tan Binh', 'Phuong 15', 'Hàng fragile, cẩn thận', 'TRK00010', 30000, 'delivered', 7503000, '2025-09-24 13:00:00', '2025-09-25 15:00:00', 5, 5, 1);

-- OrderItems
CREATE TABLE
    OrderItems (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        qty_total INT UNSIGNED NOT NULL,
        amount_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        transaction_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_orderitems_transaction FOREIGN KEY (transaction_id) REFERENCES Transactions (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_orderitems_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

-- Boards (dùng để test)
CREATE TABLE
    Boards (
        board_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Boards (title, slug) VALUES
('My First Board', 'my-first-board'),
('Project Ideas', 'project-ideas'),
('Team Discussions', 'team-discussions');