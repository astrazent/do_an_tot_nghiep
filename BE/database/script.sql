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

DROP TABLE IF EXISTS ROLES;

CREATE TABLE
    ROLES (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    Admins (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        LEVEL TINYINT (2) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        description VARCHAR(255),
        role_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_admins_role FOREIGN KEY (role_id) REFERENCES ROLES (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    Posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
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

CREATE TABLE
    Categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        parent_id INT UNSIGNED NULL,
        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES Categories (id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_categories_parent (parent_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

CREATE TABLE
    Products (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
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
        ocop_rating TINYINT UNSIGNED NULL COMMENT 'Sản phẩm OCOP được xếp hạng (3 hoặc 4 sao)',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        category_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_products_category (category_id),
        INDEX idx_products_name (name)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

CREATE TABLE
    Sliders (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        sort_order INT (11) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    ProductImages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        is_main TINYINT (1) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_productimages_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_productimages_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

CREATE TABLE
    Payments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        METHOD VARCHAR(50) NOT NULL,
        status TINYINT (1) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payments_method (METHOD),
        INDEX idx_payments_status (status)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    Shipments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        base_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        status TINYINT (1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
    Transactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        status TINYINT (1) NOT NULL,
        deli_name VARCHAR(100) NOT NULL,
        deli_phone VARCHAR(20) NOT NULL,
        deli_address VARCHAR(255) NOT NULL,
        deli_city VARCHAR(100) NOT NULL,
        deli_district VARCHAR(100) NOT NULL,
        deli_ward VARCHAR(100) NOT NULL,
        message VARCHAR(255) NOT NULL,
        tracking_number VARCHAR(100) NOT NULL,
        shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        shipment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        shipped_at DATETIME NULL,
        delivered_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id INT UNSIGNED NOT NULL,
        payment_id INT UNSIGNED NOT NULL,
        shipment_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id) REFERENCES Payments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_transactions_shipment FOREIGN KEY (shipment_id) REFERENCES Shipments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_transactions_status (status),
        INDEX idx_transactions_tracking (tracking_number),
        INDEX idx_transactions_shipment_status (shipment_status),
        INDEX idx_transactions_shipment (shipment_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

CREATE TABLE
    Boards (
        board_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
    ROLES (name, description)
VALUES
    (
        'admin',
        'Quyền quản trị hệ thống, có thể thêm, sửa, xóa dữ liệu và quản lý user'
    ),
    (
        'user',
        'Quyền người dùng bình thường, chỉ có thể xem và thao tác hạn chế trong hệ thống'
    );

INSERT INTO
    Admins (
        username,
        email,
        full_name,
        password_hash,
        LEVEL,
        description,
        role_id
    )
VALUES
    (
        'superadmin',
        'superadmin@example.com',
        'Nguyen Van A',
        '$2y$10$examplehash1',
        3,
        'Quản trị viên cao cấp, toàn quyền trên hệ thống',
        1
    ),
    (
        'admin1',
        'admin1@example.com',
        'Tran Thi B',
        '$2y$10$examplehash2',
        2,
        'Quản lý nội dung và người dùng',
        1
    ),
    (
        'admin2',
        'admin2@example.com',
        'Le Van C',
        '$2y$10$examplehash3',
        1,
        'Hỗ trợ quản lý vận hành',
        1
    ),
    (
        'useradmin',
        'useradmin@example.com',
        'Pham Thi D',
        '$2y$10$examplehash4',
        0,
        'Admin cấp thấp, quyền hạn giới hạn',
        1
    );

INSERT INTO
    Posts (
        title,
        slug,
        content,
        author_name,
        description,
        status,
        published_at,
        admin_id
    )
VALUES
    (
        'Khám phá hương vị đặc sản ba miền',
        'kham-pha-huong-vi-dac-san-ba-mien',
        '<p>...</p>',
        'Lê Thị Hà',
        'Tổng hợp những đặc sản nổi tiếng của Việt Nam',
        1,
        '2025-10-01 08:00:00',
        1
    ),
    (
        'Bí quyết chọn hải sản tươi ngon cho bữa ăn gia đình',
        'bi-quyet-chon-hai-san-tuoi-ngon',
        '<p>...</p>',
        'Trần Văn Mạnh',
        'Mẹo vặt giúp bạn trở thành chuyên gia chọn hải sản',
        1,
        '2025-10-02 11:20:00',
        2
    ),
    (
        'Các loại ruốc thơm ngon, tiện lợi cho bữa cơm nhà',
        'cac-loai-ruoc-thom-ngon-tien-loi',
        '<p>...</p>',
        'Nguyễn Thị Lan',
        'Giới thiệu các loại ruốc phổ biến và cách làm tại nhà',
        1,
        '2025-10-03 15:00:00',
        3
    ),
    (
        'Thực đơn 7 ngày với các món ngon từ gà',
        'thuc-don-7-ngay-voi-cac-mon-ngon-tu-ga',
        '<p>...</p>',
        'Phạm Văn Long',
        'Gợi ý thực đơn đa dạng với nguyên liệu chính là thịt gà',
        1,
        '2025-10-04 09:30:00',
        4
    ),
    (
        'Lợi ích bất ngờ từ các loại hạt dinh dưỡng',
        'loi-ich-bat-ngo-tu-cac-loai-hat-dinh-duong',
        '<p>...</p>',
        'Hoàng Thị Thu',
        'Tìm hiểu về công dụng của các loại hạt dinh dưỡng',
        1,
        '2025-10-05 14:00:00',
        1
    ),
    (
        'Vịt - Nguyên liệu cho những món ăn bổ dưỡng',
        'vit-nguyen-lieu-cho-nhung-mon-an-bo-duong',
        '<p>...</p>',
        'Đặng Văn Nam',
        'Tổng hợp các món ngon và bổ dưỡng được chế biến từ thịt vịt',
        1,
        '2025-10-06 10:00:00',
        2
    ),
    (
        'Biến tấu đa dạng với các món cá chế biến sẵn',
        'bien-tau-da-dang-voi-cac-mon-ca-che-bien-san',
        '<p>...</p>',
        'Vũ Thị Mai',
        'Gợi ý những món ăn ngon từ các loại cá chế biến sẵn',
        1,
        '2025-10-07 16:45:00',
        3
    ),
    (
        'Những món ngon từ thịt heo không thể chối từ',
        'nhung-mon-ngon-tu-thit-heo-khong-the-choi-tu',
        '<p>...</p>',
        'Ngô Văn Bảo',
        'Tuyển tập những món ăn đặc sắc từ thịt heo',
        1,
        '2025-10-08 12:00:00',
        4
    );

INSERT INTO
    Categories (id, name, slug, description, parent_id)
VALUES
    (
        1,
        'Thực phẩm khác',
        'thuc-pham-khac',
        'Tổng hợp các món ăn, sản vật đặc trưng của các địa phương trên cả nước.',
        NULL
    ),
    (
        2,
        'Hải sản',
        'hai-san',
        'Các món ăn được chế biến sẵn từ hải sản tươi sống.',
        NULL
    ),
    (
        3,
        'Ruốc',
        'ruoc',
        'Ruốc (chà bông) làm từ các loại thịt, cá, tôm.',
        NULL
    ),
    (
        4,
        'Sản phẩm từ gà',
        'san-pham-tu-ga',
        'Các món ăn ngon được chế biến từ thịt gà.',
        NULL
    ),
    (
        5,
        'Các loại hạt',
        'cac-loai-hat',
        'Tổng hợp các loại hạt sấy khô, rang muối tốt cho sức khỏe.',
        NULL
    ),
    (
        6,
        'Sản phẩm từ vịt',
        'san-pham-tu-vit',
        'Các món ăn ngon được chế biến từ thịt vịt.',
        NULL
    ),
    (
        7,
        'Sản phẩm từ cá',
        'san-pham-tu-ca',
        'Các món ăn được chế biến sẵn từ cá nước ngọt và cá biển.',
        NULL
    ),
    (
        8,
        'Sản phẩm từ heo',
        'san-pham-tu-heo',
        'Các món ăn ngon được chế biến từ thịt heo.',
        NULL
    ),
    (
        9,
        'Sản phẩm từ ngan',
        'san-pham-tu-ngan',
        'Các món ăn ngon được chế biến từ thịt ngan.',
        NULL
    );

INSERT INTO
    PostCategories (post_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8);

INSERT INTO
    Users (
        username,
        password_hash,
        email,
        phone,
        full_name,
        address,
        city,
        district,
        ward,
        avatar_url,
        status,
        token_started_at,
        token_expired_at
    )
VALUES
    (
        'nguyen55',
        MD5 ('nguyen55'),
        'nguyen55@example.com',
        '0912345678',
        'Phạm Thành Nguyên',
        '12B Thanh Xuân Nam',
        'Ha Noi',
        'Quan Thanh Xuan',
        'Phuong Thanh Xuan Nam',
        'assets/image/user/avatar/user_1',
        1,
        '2025-01-01 00:00:00',
        '2026-01-01 00:00:00'
    ),
    (
        'minhtuan89',
        MD5 ('abcdef'),
        'minhtuan89@example.com',
        '0987654321',
        'Trần Minh Tuấn',
        '45 Trần Duy Hưng',
        'Ha Noi',
        'Quan Cau Giay',
        'Phuong Trung Hoa',
        'assets/image/user/avatar/user_2',
        1,
        '2025-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'hoanglong_hn',
        MD5 ('longpassword'),
        'hoanglong.hn@example.com',
        '0903456789',
        'Lê Hoàng Long',
        '789 Nguyễn Chí Thanh',
        'Ha Noi',
        'Quan Dong Da',
        'Phuong Lang Thuong',
        'assets/image/user/avatar/user_3',
        0,
        '2025-03-01 00:00:00',
        '2025-09-01 00:00:00'
    ),
    (
        'maiphuong_95',
        MD5 ('qwerty'),
        'maiphuong95@example.com',
        '0904567890',
        'Phạm Thị Mai Phương',
        '101 Láng Hạ',
        'Ha Noi',
        'Quan Ba Dinh',
        'Phuong Thanh Cong',
        'assets/image/user/avatar/user_4',
        1,
        '2025-04-01 00:00:00',
        '2026-04-01 00:00:00'
    ),
    (
        'quanghuy.dev',
        MD5 ('dev@123'),
        'quanghuy.dev@example.com',
        '0905678901',
        'Hoàng Quang Huy',
        '202 Tôn Đức Thắng',
        'Ha Noi',
        'Quan Dong Da',
        'Phuong Hang Bot',
        'assets/image/user/avatar/user_5',
        1,
        '2025-05-01 00:00:00',
        '2026-05-01 00:00:00'
    ),
    (
        'thanhthao_88',
        MD5 ('thao1988'),
        'thanhthao_88@example.com',
        '0915111222',
        'Vũ Thanh Thảo',
        '55 Nguyễn Lương Bằng',
        'Ha Noi',
        'Quan Dong Da',
        'Phuong Quang Trung',
        'assets/image/user/avatar/user_6',
        1,
        '2025-06-01 00:00:00',
        '2026-06-01 00:00:00'
    ),
    (
        'duc.anh.le',
        MD5 ('letmein'),
        'duc.anh.le@example.com',
        '0978888999',
        'Lê Đức Anh',
        '88 Lò Đúc',
        'Ha Noi',
        'Quan Hai Ba Trung',
        'Phuong Dong Mac',
        'assets/image/user/avatar/user_7',
        1,
        '2025-07-01 00:00:00',
        '2026-07-01 00:00:00'
    ),
    (
        'ngocbich2000',
        MD5 ('bich2k'),
        'ngocbich2000@example.com',
        '0355123456',
        'Đặng Ngọc Bích',
        '15 Hàng Bài',
        'Ha Noi',
        'Quan Hoan Kiem',
        'Phuong Hang Bai',
        'assets/image/user/avatar/user_8',
        0,
        '2025-08-01 00:00:00',
        '2025-11-01 00:00:00'
    ),
    (
        'trungdung_it',
        MD5 ('dungit123'),
        'trungdung_it@example.com',
        '0368246810',
        'Phan Trung Dũng',
        '334 Nguyễn Trãi',
        'Ha Noi',
        'Quan Thanh Xuan',
        'Phuong Thanh Xuan Trung',
        'assets/image/user/avatar/user_9',
        1,
        '2025-09-01 00:00:00',
        '2026-09-01 00:00:00'
    ),
    (
        'linhchi_beauty',
        MD5 ('chixinhgai'),
        'linhchi_beauty@example.com',
        '0918777888',
        'Ngô Linh Chi',
        '18 Lý Thường Kiệt',
        'Ha Noi',
        'Quan Hoan Kiem',
        'Phuong Phan Chu Trinh',
        'assets/image/user/avatar/user_10',
        1,
        '2025-10-01 00:00:00',
        '2026-10-01 00:00:00'
    );

INSERT INTO
    Products (
        id,
        name,
        slug,
        description,
        origin_price,
        price,
        buyed,
        rate_point_total,
        rate_count,
        stock_qty,
        low_stock_threshold,
        status,
        ocop_rating,
        category_id
    )
VALUES
    (
        1,
        'Bánh pía Sóc Trăng',
        'banh-pia-soc-trang',
        'Bánh pía Sóc Trăng thơm ngon, đặc sản miền Tây với lớp vỏ mỏng và nhân đậu xanh sầu riêng béo ngậy.',
        70000.00,
        65000.00,
        150,
        48,
        10,
        200,
        20,
        1,
        4,
        1
    ),
    (
        2,
        'Bò một nắng Krông Pa',
        'bo-mot-nang-krong-pa',
        'Đặc sản bò một nắng Krông Pa, thịt bò tươi được tẩm ướp gia vị đậm đà và phơi qua một nắng giòn.',
        550000.00,
        525000.00,
        80,
        95,
        20,
        100,
        10,
        1,
        NULL,
        1
    ),
    (
        3,
        'Cà phê Buôn Ma Thuột',
        'ca-phe-buon-ma-thuot',
        'Cà phê rang xay nguyên chất từ thủ phủ cà phê Buôn Ma Thuột, hương thơm nồng nàn, vị đậm đà.',
        150000.00,
        135000.00,
        250,
        190,
        40,
        300,
        30,
        1,
        4,
        1
    ),
    (
        4,
        'Chả ốc',
        'cha-oc',
        'Chả ốc dai giòn sần sật, kết hợp giữa thịt ốc tươi và các loại gia vị truyền thống, món ngon khó cưỡng.',
        120000.00,
        110000.00,
        120,
        68,
        15,
        150,
        15,
        1,
        NULL,
        1
    ),
    (
        5,
        'Dê chiên giòn Tây Ninh',
        'de-chien-gion-tay-ninh',
        'Thịt dê tươi được chế biến theo công thức đặc biệt của Tây Ninh, chiên giòn rụm, thơm nức mũi.',
        250000.00,
        230000.00,
        60,
        45,
        10,
        80,
        10,
        1,
        NULL,
        1
    ),
    (
        6,
        'Gân bò rau tiến vua',
        'gan-bo-rau-tien-vua',
        'Món gỏi gân bò giòn sần sật kết hợp với rau tiến vua thanh mát, nước sốt chua ngọt đậm vị.',
        180000.00,
        175000.00,
        90,
        88,
        20,
        120,
        10,
        1,
        3,
        1
    ),
    (
        7,
        'Hạt điều rang muối Bình Phước',
        'hat-dieu-rang-muoi-binh-phuoc',
        'Hạt điều Bình Phước loại 1, được rang muối thủ công, giữ trọn vị bùi béo và hương thơm tự nhiên.',
        300000.00,
        280000.00,
        300,
        240,
        50,
        400,
        40,
        1,
        4,
        1
    ),
    (
        8,
        'Mắm tép chưng thịt',
        'mam-tep-chung-thit',
        'Mắm tép chưng thịt đậm đà hương vị truyền thống, sản phẩm sạch, không chất bảo quản, ăn cùng cơm nóng tuyệt ngon.',
        160000.00,
        150000.00,
        180,
        145,
        30,
        250,
        25,
        1,
        4,
        1
    ),
    (
        9,
        'Mật ong rừng U Minh',
        'mat-ong-rung-u-minh',
        'Mật ong nguyên chất khai thác từ rừng tràm U Minh, có màu vàng óng, hương thơm đặc trưng và vị ngọt thanh.',
        800000.00,
        750000.00,
        100,
        115,
        25,
        100,
        10,
        1,
        4,
        1
    ),
    (
        10,
        'Mè xửng Huế',
        'me-xung-hue',
        'Đặc sản Mè xửng Huế dẻo thơm, ngọt bùi, là sự hòa quyện của mạch nha, đậu phộng và mè rang.',
        50000.00,
        45000.00,
        400,
        285,
        60,
        500,
        50,
        1,
        3,
        1
    ),
    (
        11,
        'Mọc ốc',
        'moc-oc',
        'Mọc ốc được làm từ thịt ốc tươi xay nhuyễn, nấm mèo và giò sống, viên mọc dai ngon, đậm đà.',
        130000.00,
        120000.00,
        110,
        76,
        18,
        130,
        15,
        1,
        NULL,
        1
    ),
    (
        12,
        'Rượu cần Tây Nguyên',
        'ruou-can-tay-nguyen',
        'Rượu cần là tinh hoa văn hóa của núi rừng Tây Nguyên, được ủ từ men lá cây và gạo nếp, hương vị độc đáo.',
        200000.00,
        180000.00,
        70,
        92,
        20,
        90,
        10,
        1,
        4,
        1
    ),
    (
        13,
        'Trà sen Tây Hồ',
        'tra-sen-tay-ho',
        'Trà sen Tây Hồ được ướp hương từ những bông sen Bách Diệp, mang đến hương thơm thanh khiết và tinh tế.',
        450000.00,
        420000.00,
        130,
        140,
        30,
        150,
        15,
        1,
        4,
        1
    ),
    (
        14,
        'Trứng kiến Tây Bắc',
        'trung-kien-tay-bac',
        'Đặc sản độc đáo của núi rừng Tây Bắc, trứng kiến non béo ngậy, thường dùng để nấu xôi hoặc làm gỏi.',
        350000.00,
        330000.00,
        50,
        38,
        8,
        60,
        10,
        1,
        NULL,
        1
    ),
    (
        15,
        'Bề bề rang muối',
        'be-be-rang-muoi',
        'Bề bề tươi ngon được rang cùng muối và sả ớt, vỏ giòn, thịt ngọt đậm đà, là món nhậu hấp dẫn.',
        280000.00,
        260000.00,
        140,
        130,
        28,
        180,
        20,
        1,
        NULL,
        2
    ),
    (
        16,
        'Cá bóp nấu me',
        'ca-bop-nau-me',
        'Lẩu cá bóp nấu me chua thanh, thịt cá bóp ngọt và chắc, là món ăn giải nhiệt và bổ dưỡng.',
        320000.00,
        290000.00,
        110,
        98,
        22,
        120,
        10,
        1,
        4,
        2
    ),
    (
        17,
        'Cá linh bông',
        'ca-linh-bong',
        'Cá linh mùa nước nổi, thân nhỏ, xương mềm, thịt ngọt, thường dùng để nấu lẩu hoặc kho lạt.',
        180000.00,
        165000.00,
        200,
        175,
        38,
        250,
        25,
        1,
        3,
        2
    ),
    (
        18,
        'Chả cá Móng',
        'cha-ca-mong',
        'Chả cá Móng Cái nổi tiếng với độ dai, giòn và hương vị đậm đà từ thịt cá tươi nguyên chất.',
        240000.00,
        220000.00,
        160,
        150,
        32,
        200,
        20,
        1,
        NULL,
        2
    ),
    (
        19,
        'Chả cá mực tôm',
        'cha-ca-muc-tom',
        'Sự kết hợp hoàn hảo giữa cá, mực và tôm tươi, tạo nên món chả dai ngon, đậm vị biển.',
        260000.00,
        245000.00,
        130,
        112,
        25,
        150,
        15,
        1,
        NULL,
        2
    ),
    (
        20,
        'Chả mỡ ghẹ',
        'cha-mo-ghe',
        'Chả mỡ ghẹ béo ngậy, thơm lừng mùi ghẹ tươi, là món ăn độc đáo và đầy dinh dưỡng từ hải sản.',
        300000.00,
        280000.00,
        100,
        89,
        20,
        110,
        10,
        1,
        4,
        2
    ),
    (
        21,
        'Chả mực Hạ Long',
        'cha-muc-ha-long',
        'Đặc sản trứ danh Hạ Long, chả mực được giã tay dai giòn, thơm nức hương mực mai tươi.',
        480000.00,
        450000.00,
        220,
        230,
        50,
        250,
        25,
        1,
        4,
        2
    ),
    (
        22,
        'Chả tôm',
        'cha-tom',
        'Chả tôm được làm từ tôm tươi xay nhuyễn, có độ dai và vị ngọt tự nhiên, thích hợp chiên hoặc nấu canh.',
        230000.00,
        210000.00,
        170,
        155,
        35,
        220,
        20,
        1,
        NULL,
        2
    ),
    (
        23,
        'Cua Cà Mau',
        'cua-ca-mau',
        'Cua Cà Mau nổi tiếng chắc thịt, ngọt và nhiều gạch. Sản phẩm được giao sống tận nơi.',
        600000.00,
        580000.00,
        120,
        142,
        30,
        100,
        10,
        1,
        4,
        2
    ),
    (
        24,
        'Gỏi cá trích',
        'goi-ca-trich',
        'Gỏi cá trích Phú Quốc với cá tươi, dừa nạo và rau thơm, cuốn bánh tráng chấm nước mắm chua ngọt.',
        190000.00,
        175000.00,
        150,
        130,
        29,
        160,
        15,
        1,
        4,
        2
    ),
    (
        25,
        'Hàu nướng mỡ hành',
        'hau-nuong-mo-hanh',
        'Hàu sữa tươi sống được nướng trên bếp than cùng mỡ hành thơm lừng, đậu phộng béo bùi.',
        150000.00,
        140000.00,
        250,
        210,
        45,
        300,
        30,
        1,
        NULL,
        2
    ),
    (
        26,
        'Mực một nắng',
        'muc-mot-nang',
        'Mực lá được phơi qua đúng một nắng, giữ được độ dẻo, ngọt và hương thơm đặc trưng của biển.',
        700000.00,
        650000.00,
        180,
        195,
        42,
        200,
        20,
        1,
        4,
        2
    ),
    (
        27,
        'Nem hải sản',
        'nem-hai-san',
        'Nem hải sản với vỏ ngoài giòn tan, bên trong là nhân tôm, cua, ghẹ hòa quyện cùng sốt mayonnaise béo ngậy.',
        140000.00,
        125000.00,
        280,
        250,
        55,
        350,
        35,
        1,
        NULL,
        2
    ),
    (
        28,
        'Sá sùng nướng',
        'sa-sung-nuong',
        'Sá sùng khô, đặc sản quý hiếm của vùng biển Quan Lạn, nướng lên có vị ngọt đậm, dai và thơm.',
        900000.00,
        880000.00,
        70,
        85,
        18,
        80,
        10,
        1,
        NULL,
        2
    ),
    (
        29,
        'Tôm sú Bạc Liêu',
        'tom-su-bac-lieu',
        'Tôm sú Bạc Liêu được nuôi trồng theo mô hình sinh thái, thịt chắc, ngọt và an toàn cho sức khỏe.',
        450000.00,
        430000.00,
        190,
        180,
        40,
        200,
        20,
        1,
        4,
        2
    ),
    (
        30,
        'Ruốc bề bề',
        'ruoc-be-be',
        'Ruốc làm từ 100% thịt bề bề tươi, sợi ruốc bông, tơi, vị ngọt đậm đà, giàu canxi.',
        180000.00,
        170000.00,
        130,
        96,
        22,
        150,
        15,
        1,
        NULL,
        3
    ),
    (
        31,
        'Ruốc cá basa',
        'ruoc-ca-basa',
        'Ruốc cá basa thơm ngon, không tanh, giàu Omega-3, thích hợp cho cả trẻ em và người lớn.',
        120000.00,
        110000.00,
        200,
        158,
        35,
        250,
        25,
        1,
        NULL,
        3
    ),
    (
        32,
        'Ruốc cá lóc',
        'ruoc-ca-loc',
        'Ruốc cá lóc đồng nguyên chất, sợi vàng ươm, thơm ngon, bổ dưỡng, tốt cho người ốm và trẻ nhỏ.',
        160000.00,
        150000.00,
        180,
        140,
        30,
        200,
        20,
        1,
        3,
        3
    ),
    (
        33,
        'Ruốc cá rô đồng',
        'ruoc-ca-ro-dong',
        'Ruốc làm từ cá rô đồng tự nhiên, thịt dai, thơm, được sao khô thủ công, giữ trọn vị ngọt của cá.',
        170000.00,
        155000.00,
        150,
        110,
        25,
        180,
        15,
        1,
        NULL,
        3
    ),
    (
        34,
        'Ruốc cá thu',
        'ruoc-ca-thu',
        'Ruốc cá thu giàu dinh dưỡng, thịt cá thơm, sợi ruốc bông, là lựa chọn tuyệt vời cho bữa ăn gia đình.',
        250000.00,
        235000.00,
        210,
        190,
        40,
        250,
        25,
        1,
        4,
        3
    ),
    (
        35,
        'Ruốc mắm Huế',
        'ruoc-mam-hue',
        'Đặc sản mắm ruốc Huế thơm nồng đặc trưng, dùng để nêm nếm các món bún bò, lẩu hoặc xào nấu.',
        80000.00,
        70000.00,
        300,
        245,
        50,
        400,
        40,
        1,
        3,
        3
    ),
    (
        36,
        'Ruốc tép Đồng Tháp',
        'ruoc-tep-dong-thap',
        'Ruốc làm từ tép đồng tươi, có màu đỏ tự nhiên, vị ngọt đậm, thơm mùi tép, ăn kèm cơm trắng hoặc cháo.',
        140000.00,
        130000.00,
        220,
        180,
        40,
        300,
        30,
        1,
        NULL,
        3
    ),
    (
        37,
        'Ruốc thịt lợn Nam Định',
        'ruoc-thit-lon-nam-dinh',
        'Ruốc thịt lợn làm theo công thức gia truyền Nam Định, sợi ruốc bông, tơi, vàng óng và thơm ngon.',
        320000.00,
        290000.00,
        350,
        320,
        65,
        400,
        40,
        1,
        4,
        3
    ),
    (
        38,
        'Ruốc tôm Bình Định',
        'ruoc-tom-binh-dinh',
        'Ruốc tôm Bình Định được làm từ tôm đất tươi, giã tay, có vị ngọt thanh, thơm mùi tôm và màu sắc hấp dẫn.',
        280000.00,
        260000.00,
        240,
        220,
        48,
        300,
        30,
        1,
        NULL,
        3
    ),
    (
        39,
        'Ruốc tôm đất Cà Mau',
        'ruoc-tom-dat-ca-mau',
        'Ruốc làm từ tôm đất Cà Mau 100%, không pha trộn, sợi ruốc dai, ngọt và đậm đà hương vị miền sông nước.',
        300000.00,
        285000.00,
        190,
        170,
        36,
        220,
        20,
        1,
        4,
        3
    ),
    (
        40,
        'Ruốc tôm Hạ Long',
        'ruoc-tom-ha-long',
        'Ruốc tôm Hạ Long nổi tiếng với sợi ruốc bông, tơi, vị ngọt đậm của tôm he, món quà ý nghĩa từ biển.',
        290000.00,
        270000.00,
        230,
        205,
        45,
        280,
        25,
        1,
        4,
        3
    ),
    (
        41,
        'Ruốc tôm rong biển',
        'ruoc-tom-rong-bien',
        'Sự kết hợp độc đáo giữa ruốc tôm và rong biển, mang lại hương vị mới lạ và bổ sung nhiều khoáng chất.',
        200000.00,
        185000.00,
        160,
        135,
        30,
        200,
        20,
        1,
        NULL,
        3
    ),
    (
        42,
        'Da Gà Chiên Giòn',
        'da-ga-chien-gion',
        'Da gà được làm sạch, tẩm ướp gia vị đậm đà rồi chiên giòn rụm, là món ăn vặt hấp dẫn khó cưỡng.',
        75000.00,
        69000.00,
        180,
        142,
        30,
        200,
        20,
        1,
        NULL,
        4
    ),
    (
        43,
        'Gà Cháy Tỏi',
        'ga-chay-toi',
        'Thịt gà mềm ngọt hòa quyện với hương thơm nồng nàn của tỏi phi vàng, tạo nên món ăn đưa cơm hấp dẫn.',
        180000.00,
        169000.00,
        150,
        115,
        25,
        150,
        15,
        1,
        3,
        4
    ),
    (
        44,
        'Gà Đông Tảo Ủ Muối',
        'ga-dong-tao-u-muoi',
        'Đặc sản gà Đông Tảo trứ danh với lớp da giòn, thịt ngọt và chắc, được ủ muối hoa tiêu thơm lừng.',
        450000.00,
        429000.00,
        90,
        85,
        18,
        100,
        10,
        1,
        4,
        4
    ),
    (
        45,
        'Gà Nướng Muối Ớt',
        'ga-nuong-muoi-ot',
        'Gà ta được tẩm ướp muối ớt cay nồng, nướng trên than hồng cho lớp da vàng giòn, thịt mềm và mọng nước.',
        250000.00,
        235000.00,
        210,
        190,
        40,
        200,
        20,
        1,
        4,
        4
    ),
    (
        46,
        'Gà Nướng Thảo Mộc',
        'ga-nuong-thao-moc',
        'Hương vị độc đáo từ các loại thảo mộc núi rừng thấm đượm trong từng thớ thịt gà nướng mềm thơm.',
        260000.00,
        245000.00,
        130,
        110,
        24,
        150,
        15,
        1,
        NULL,
        4
    ),
    (
        47,
        'Gà Ủ Muối',
        'ga-u-muoi',
        'Gà ta nguyên con được ủ muối thảo dược, da vàng óng, thịt dai ngọt và giữ trọn hương vị tự nhiên.',
        220000.00,
        209000.00,
        300,
        280,
        60,
        250,
        25,
        1,
        3,
        4
    ),
    (
        48,
        'Gà Ủ Xì Dầu',
        'ga-u-xi-dau',
        'Món gà ủ xì dầu với công thức đặc biệt, thịt gà mềm thấm vị, đậm đà, hương thơm quyến rũ.',
        230000.00,
        219000.00,
        180,
        165,
        35,
        180,
        20,
        1,
        NULL,
        4
    ),
    (
        49,
        'Gà Viên Chiên',
        'ga-vien-chien',
        'Gà viên chiên vàng giòn bên ngoài, mềm ngọt bên trong, là món ăn vặt yêu thích của mọi lứa tuổi.',
        90000.00,
        85000.00,
        250,
        210,
        45,
        300,
        30,
        1,
        NULL,
        4
    ),
    (
        50,
        'Há Cảo Gà',
        'ha-cao-ga',
        'Lớp vỏ bánh mềm dai bọc lấy nhân thịt gà và rau củ tươi ngon, hấp lên thơm phức, chấm cùng nước tương đậm đà.',
        110000.00,
        99000.00,
        160,
        130,
        28,
        200,
        20,
        1,
        NULL,
        4
    ),
    (
        51,
        'Gà Kho Mắm',
        'ga-kho-mam',
        'Hương vị dân dã mà đậm đà khó quên của món gà kho mắm, thịt gà săn chắc thấm đượm vị mắm thơm nồng.',
        150000.00,
        139000.00,
        190,
        175,
        38,
        220,
        20,
        1,
        3,
        4
    ),
    (
        52,
        'Bánh Hạt Điều',
        'banh-hat-dieu',
        'Bánh quy bơ giòn tan kết hợp với những hạt điều bùi béo, tạo nên món ăn vặt thơm ngon, dinh dưỡng.',
        130000.00,
        120000.00,
        140,
        112,
        25,
        180,
        15,
        1,
        NULL,
        5
    ),
    (
        53,
        'Bánh Thanh Hạnh Nhân',
        'banh-thanh-hanh-nhan',
        'Những thanh bánh giòn rụm phủ đầy lát hạnh nhân rang vàng, vị ngọt nhẹ, béo bùi tự nhiên.',
        150000.00,
        139000.00,
        200,
        185,
        40,
        250,
        25,
        1,
        3,
        5
    ),
    (
        54,
        'Bánh Thuyền Macca',
        'banh-thuyen-macca',
        'Đế bánh giòn tan hình chiếc thuyền, bên trên là sự kết hợp của macca, hạt điều, hạnh nhân và bí xanh.',
        160000.00,
        149000.00,
        170,
        150,
        32,
        200,
        20,
        1,
        NULL,
        5
    ),
    (
        55,
        'Hạnh Nhân Rang Bơ',
        'hanh-nhan-rang-bo',
        'Hạnh nhân nhập khẩu được rang cùng bơ và muối, giòn rụm, thơm lừng, là món ăn vặt tốt cho sức khỏe.',
        280000.00,
        265000.00,
        220,
        200,
        42,
        250,
        25,
        1,
        NULL,
        5
    ),
    (
        56,
        'Hạt Điều Rang Muối',
        'hat-dieu-rang-muoi',
        'Hạt điều Bình Phước loại A, hạt to đều, được rang muối thủ công, giữ vị ngọt bùi tự nhiên.',
        320000.00,
        299000.00,
        400,
        380,
        80,
        350,
        35,
        1,
        4,
        5
    ),
    (
        57,
        'Hạt Macca Sấy Nứt Vỏ',
        'hat-macca-say-nut-vo',
        'Nữ hoàng của các loại hạt, hạt macca sấy khô tự nhiên, nứt vỏ dễ dàng, vị béo ngậy, thơm ngon.',
        350000.00,
        330000.00,
        250,
        230,
        50,
        300,
        30,
        1,
        4,
        5
    ),
    (
        58,
        'Hạt Óc Chó',
        'hat-oc-cho',
        'Hạt óc chó chứa nhiều Omega-3, tốt cho trí não và tim mạch, vị bùi, béo nhẹ, dễ ăn.',
        300000.00,
        285000.00,
        210,
        195,
        41,
        220,
        20,
        1,
        NULL,
        5
    ),
    (
        59,
        'Hạt Sen Sấy Giòn',
        'hat-sen-say-gion',
        'Hạt sen được sấy giòn bằng công nghệ hiện đại, giữ nguyên giá trị dinh dưỡng, vị bùi, ngọt thanh.',
        180000.00,
        169000.00,
        190,
        170,
        36,
        250,
        25,
        1,
        3,
        5
    ),
    (
        60,
        'Mix 5 Loại Hạt Dinh Dưỡng',
        'mix-5-loai-hat-dinh-duong',
        'Hỗn hợp 5 loại hạt cao cấp: óc chó, macca, hạnh nhân, hạt điều, bí xanh. Cung cấp năng lượng và dưỡng chất.',
        340000.00,
        325000.00,
        280,
        260,
        55,
        300,
        30,
        1,
        NULL,
        5
    ),
    (
        61,
        'Thanh Rong Biển Kẹp Hạt',
        'thanh-rong-bien-kep-hat',
        'Rong biển sấy giòn kẹp các loại hạt dinh dưỡng, là món ăn vặt lạ miệng, thơm ngon và tốt cho sức khỏe.',
        120000.00,
        110000.00,
        240,
        215,
        48,
        300,
        30,
        1,
        NULL,
        5
    ),
    (
        62,
        'Chả Chân Vịt',
        'cha-chan-vit',
        'Món chả độc đáo làm từ chân vịt rút xương, giòn sần sật, đậm đà gia vị, thích hợp làm món nhậu hoặc ăn chơi.',
        140000.00,
        129000.00,
        130,
        105,
        23,
        150,
        15,
        1,
        NULL,
        6
    ),
    (
        63,
        'Chả Vịt Thúy Hạnh',
        'cha-vit-thuy-hanh',
        'Đặc sản chả vịt Thúy Hạnh nổi tiếng với hương vị thơm ngon đặc trưng, thịt vịt mềm ngọt quyện mỡ hành béo ngậy.',
        190000.00,
        179000.00,
        110,
        98,
        22,
        130,
        10,
        1,
        4,
        6
    ),
    (
        64,
        'Chân Vịt Rút Xương Ủ Muối',
        'chan-vit-rut-xuong-u-muoi',
        'Chân vịt rút xương tiện lợi, được ủ muối thảo mộc, giòn sần sật, chấm cùng sốt chấm cay cay là hết ý.',
        150000.00,
        135000.00,
        200,
        180,
        40,
        250,
        25,
        1,
        NULL,
        6
    ),
    (
        65,
        'Chân Vịt Rút Xương Ủ Xì Dầu',
        'chan-vit-rut-xuong-u-xi-dau',
        'Chân vịt rút xương ngâm trong nước sốt xì dầu thảo mộc đậm đà, vị mặn ngọt hài hòa, thơm nức.',
        155000.00,
        140000.00,
        180,
        160,
        35,
        220,
        20,
        1,
        NULL,
        6
    ),
    (
        66,
        'Mọc Vịt',
        'moc-vit',
        'Viên mọc làm từ thịt vịt xay nhuyễn, nấm hương và gia vị, dai ngon, ngọt thanh, dùng để nấu canh hoặc thả lẩu.',
        130000.00,
        119000.00,
        150,
        125,
        28,
        180,
        15,
        1,
        NULL,
        6
    ),
    (
        67,
        'Pate Gan Vịt',
        'pate-gan-vit',
        'Pate gan vịt kiểu Pháp béo ngậy, mềm mịn, thơm lừng hương vị của rượu cognac và các loại gia vị hảo hạng.',
        250000.00,
        230000.00,
        100,
        90,
        20,
        120,
        10,
        1,
        4,
        6
    ),
    (
        68,
        'Vịt Quay',
        'vit-quay',
        'Vịt quay da giòn rụm màu cánh gián, thịt mềm ngọt, được tẩm ướp công phu theo công thức gia truyền.',
        350000.00,
        329000.00,
        160,
        145,
        30,
        150,
        15,
        1,
        3,
        6
    ),
    (
        69,
        'Vịt Tiềm Hạt Sen',
        'vit-tiem-hat-sen',
        'Món ăn bổ dưỡng với thịt vịt mềm rục, hạt sen bùi thơm và nước dùng ngọt thanh từ các vị thuốc bắc.',
        280000.00,
        265000.00,
        120,
        108,
        24,
        130,
        10,
        1,
        NULL,
        6
    ),
    (
        70,
        'Vịt Ủ Xì Dầu',
        'vit-u-xi-dau',
        'Thịt vịt mềm ngọt thấm đẫm trong nước sốt xì dầu và hoa hồi, quế, thảo quả, hương vị khó quên.',
        270000.00,
        255000.00,
        140,
        120,
        26,
        160,
        15,
        1,
        NULL,
        6
    ),
    (
        71,
        'Chả Cá Thác Lác Tươi',
        'cha-ca-thac-lac-tuoi',
        'Chả cá thác lác nguyên chất, được quết tay dai ngon, không hàn the, ngọt vị cá tự nhiên.',
        200000.00,
        185000.00,
        250,
        230,
        50,
        300,
        30,
        1,
        4,
        7
    ),
    (
        72,
        'Cá Chiên Tẩm Gia Vị Sấy Khô',
        'ca-chien-tam-gia-vi-say-kho',
        'Cá nục được chiên giòn rồi rim với gia vị mặn ngọt, sau đó sấy khô, món ăn vặt hoặc ăn với cơm đều ngon.',
        150000.00,
        139000.00,
        180,
        160,
        35,
        200,
        20,
        1,
        NULL,
        7
    ),
    (
        73,
        'Cá Chua Ngọt Đông Hũ',
        'ca-chua-ngot-dong-hu',
        'Cá được kho rim chua ngọt đậm đà, đóng trong hũ tiện lợi, chỉ cần hâm nóng là có thể dùng ngay.',
        130000.00,
        119000.00,
        150,
        130,
        28,
        180,
        15,
        1,
        3,
        7
    ),
    (
        74,
        'Cá Hộp',
        'ca-hop',
        'Cá nục hoặc cá trích sốt cà chua, sản phẩm tiện lợi, giàu dinh dưỡng cho bữa ăn nhanh.',
        40000.00,
        35000.00,
        500,
        450,
        95,
        600,
        60,
        1,
        NULL,
        7
    ),
    (
        75,
        'Cá Khô',
        'ca-kho',
        'Cá lóc hoặc cá sặc khô, được phơi nắng tự nhiên, thịt dai ngọt, dùng để nướng, chiên hoặc làm gỏi.',
        250000.00,
        230000.00,
        200,
        185,
        40,
        250,
        25,
        1,
        3,
        7
    ),
    (
        76,
        'Cá Lóc Rim Me',
        'ca-loc-rim-me',
        'Thịt cá lóc đồng chiên vàng, rim cùng nước sốt me chua ngọt đậm đà, món ăn hao cơm trứ danh.',
        160000.00,
        149000.00,
        170,
        155,
        33,
        200,
        20,
        1,
        NULL,
        7
    ),
    (
        77,
        'Cá Một Nắng',
        'ca-mot-nang',
        'Cá dứa hoặc cá đù một nắng, thịt dẻo, vị ngọt tự nhiên, không quá khô, chiên lên thơm lừng.',
        300000.00,
        280000.00,
        220,
        205,
        44,
        250,
        25,
        1,
        4,
        7
    ),
    (
        78,
        'Cá Mực Một Nắng Tẩm Gia Vị',
        'ca-muc-mot-nang-tam-gia-vi',
        'Mực một nắng dẻo ngọt, được tẩm ướp gia vị cay cay mặn mặn, nướng lên thơm nức mũi.',
        380000.00,
        359000.00,
        190,
        178,
        38,
        200,
        20,
        1,
        NULL,
        7
    ),
    (
        79,
        'Cá Rim',
        'ca-rim',
        'Cá cơm hoặc cá bống rim mặn ngọt, món ăn dân dã nhưng đậm đà hương vị quê hương.',
        120000.00,
        110000.00,
        280,
        260,
        55,
        300,
        30,
        1,
        NULL,
        7
    ),
    (
        80,
        'Cá Rô Phi Sấy Giòn',
        'ca-ro-phi-say-gion',
        'Thịt cá rô phi được phi lê, tẩm ướp và sấy giòn tan, có thể ăn liền như snack.',
        140000.00,
        129000.00,
        160,
        140,
        30,
        200,
        20,
        1,
        NULL,
        7
    ),
    (
        81,
        'Cá Thu Rim Tỏi Ớt',
        'ca-thu-rim-toi-ot',
        'Khúc cá thu tươi được chiên vàng, rim trong nước sốt tỏi ớt mặn ngọt, đậm đà, thơm lừng.',
        280000.00,
        265000.00,
        190,
        175,
        37,
        220,
        20,
        1,
        4,
        7
    ),
    (
        82,
        'Chả Cá Thác Lác Hậu Giang',
        'cha-ca-thac-lac-hau-giang',
        'Đặc sản Hậu Giang, chả cá thác lác dai ngon, thơm mùi thì là, chiên vàng hoặc nấu lẩu đều tuyệt.',
        210000.00,
        195000.00,
        210,
        198,
        42,
        250,
        25,
        1,
        4,
        7
    ),
    (
        83,
        'Chả Cá Thác Lác Tẩm Gia Vị',
        'cha-ca-thac-lac-tam-gia-vi',
        'Chả cá thác lác đã được quết dai và tẩm ướp gia vị vừa ăn, tiện lợi cho việc chế biến.',
        220000.00,
        205000.00,
        180,
        165,
        36,
        200,
        20,
        1,
        NULL,
        7
    ),
    (
        84,
        'Pate Cá Hồi Hạ Long',
        'pate-ca-hoi-ha-long',
        'Pate làm từ cá hồi tươi vùng biển Hạ Long, béo ngậy, thơm ngon, giàu Omega-3, dùng kèm bánh mì.',
        190000.00,
        175000.00,
        140,
        128,
        28,
        160,
        15,
        1,
        3,
        7
    ),
    (
        85,
        'Chả Giò Chả Lụa',
        'cha-gio-cha-lua',
        'Combo chả giò và chả lụa truyền thống, được làm từ thịt heo tươi ngon theo công thức gia truyền, thơm ngon, đậm đà.',
        180000.00,
        169000.00,
        250,
        235,
        50,
        300,
        30,
        1,
        4,
        8
    ),
    (
        86,
        'Chân Giò Giả Cầy',
        'chan-gio-gia-cay',
        'Chân giò heo được thui vàng, nấu cùng riềng, mẻ, mắm tôm, tạo nên hương vị giả cầy đặc trưng, thơm nức mũi.',
        220000.00,
        205000.00,
        180,
        168,
        36,
        200,
        20,
        1,
        3,
        8
    ),
    (
        87,
        'Đặc Sản Chả Chìa Hải Phòng',
        'dac-san-cha-chia-hai-phong',
        'Chả chìa (chả sả) Hải Phòng, thịt heo băm nhuyễn bọc quanh cây sả, nướng thơm lừng, hương vị khó quên.',
        190000.00,
        179000.00,
        160,
        145,
        31,
        180,
        15,
        1,
        4,
        8
    ),
    (
        88,
        'Đặc Sản Chả Cốm Hà Nội',
        'dac-san-cha-com-ha-noi',
        'Thức quà của mùa thu Hà Nội, chả cốm dẻo thơm, sự hòa quyện giữa thịt heo xay và những hạt cốm non xanh mướt.',
        210000.00,
        199000.00,
        300,
        280,
        60,
        250,
        25,
        1,
        4,
        8
    ),
    (
        89,
        'Đặc Sản Chả Sụn',
        'dac-san-cha-sun',
        'Chả sụn giòn sần sật, được làm từ thịt heo và sụn non, chiên vàng hay nướng đều thơm ngon khó cưỡng.',
        200000.00,
        185000.00,
        220,
        205,
        44,
        250,
        25,
        1,
        NULL,
        8
    ),
    (
        90,
        'Khâu Nhục Lạng Sơn',
        'khau-nhuc-lang-son',
        'Món ăn đặc sản Lạng Sơn, thịt ba chỉ được tẩm ướp công phu, hầm mềm tan, béo ngậy mà không ngán.',
        250000.00,
        235000.00,
        150,
        140,
        30,
        150,
        15,
        1,
        3,
        8
    ),
    (
        91,
        'Mắm Nêm Tai Heo',
        'mam-nem-tai-heo',
        'Tai heo giòn sần sật ngâm trong mắm nêm đậm đà, thêm chút dứa và gia vị, món nhậu hay ăn kèm bún đều tuyệt.',
        140000.00,
        129000.00,
        130,
        115,
        25,
        160,
        15,
        1,
        NULL,
        8
    ),
    (
        92,
        'Nem Chua Thanh Hóa',
        'nem-chua-thanh-hoa',
        'Đặc sản nem chua Thanh Hóa, vị chua thanh, cay nồng của tỏi ớt, thơm mùi lá chuối, món quà quê ý nghĩa.',
        90000.00,
        80000.00,
        400,
        380,
        85,
        500,
        50,
        1,
        4,
        8
    ),
    (
        93,
        'Nem Rán Hà Nội',
        'nem-ran-ha-noi',
        'Nem rán (chả giò) theo phong vị Hà Nội, vỏ giòn rụm, nhân đầy đặn thịt, mộc nhĩ, miến, chấm nước mắm chua ngọt.',
        120000.00,
        110000.00,
        350,
        320,
        70,
        400,
        40,
        1,
        NULL,
        8
    ),
    (
        94,
        'Nem Lụi Nha Trang',
        'nem-lui-nha-trang',
        'Nem nướng làm từ thịt heo xay, được lụi trên que sả hoặc que tre, nướng than hồng thơm lừng, ăn kèm rau sống và bánh tráng.',
        160000.00,
        149000.00,
        280,
        265,
        58,
        300,
        30,
        1,
        3,
        8
    ),
    (
        95,
        'Pate Gan Heo',
        'pate-gan-heo',
        'Pate gan heo nhà làm, mềm mịn, béo ngậy, thơm mùi tiêu, không chất bảo quản, hoàn hảo cho bữa sáng.',
        150000.00,
        135000.00,
        210,
        198,
        42,
        250,
        25,
        1,
        NULL,
        8
    ),
    (
        96,
        'Tai Heo Cuộn Lưỡi',
        'tai-heo-cuon-luoi',
        'Món nhậu hấp dẫn với tai heo giòn và lưỡi heo mềm được cuộn chặt, luộc chín, thái mỏng chấm mắm gừng.',
        180000.00,
        165000.00,
        170,
        158,
        34,
        200,
        20,
        1,
        NULL,
        8
    ),
    (
        97,
        'Tai Heo Ủ Muối',
        'tai-heo-u-muoi',
        'Tai heo được làm sạch, ủ muối hoa tiêu, giòn sần sật, thơm mùi gia vị, là món khai vị tuyệt vời.',
        170000.00,
        159000.00,
        190,
        175,
        38,
        220,
        20,
        1,
        3,
        8
    ),
    (
        98,
        'Tai Heo Ủ Xì Dầu',
        'tai-heo-u-xi-dau',
        'Tai heo ngâm trong nước sốt xì dầu thảo mộc đậm đà, vị mặn ngọt hài hòa, thơm nức mùi hoa hồi, quế.',
        175000.00,
        162000.00,
        160,
        145,
        31,
        180,
        15,
        1,
        NULL,
        8
    ),
    (
        99,
        'Thịt Chưng Mắm Tép',
        'thit-chung-mam-tep',
        'Món ăn hao cơm trứ danh, thịt vai heo xay chưng cùng mắm tép, riềng, hành khô cho đến khi keo lại, thơm lừng.',
        190000.00,
        175000.00,
        240,
        225,
        48,
        260,
        25,
        1,
        4,
        8
    ),
    (
        100,
        'Thịt Heo Sấy Khô',
        'thit-heo-say-kho',
        'Thịt heo sấy khô kiểu gác bếp, được tẩm ướp gia vị đậm đà, dai ngọt, cay cay, là món nhậu lai rai hấp dẫn.',
        350000.00,
        329000.00,
        200,
        190,
        40,
        220,
        20,
        1,
        3,
        8
    ),
    (
        101,
        'Thịt Heo Xông Khói',
        'thit-heo-xong-khoi',
        'Thịt ba chỉ heo được ướp gia vị và xông khói bằng gỗ sồi, mang lại hương vị thơm ngon đặc trưng.',
        400000.00,
        379000.00,
        180,
        170,
        35,
        200,
        20,
        1,
        NULL,
        8
    ),
    (
        102,
        'Xúc Xích Cốm',
        'xuc-xich-com',
        'Sự kết hợp độc đáo giữa xúc xích heo và cốm xanh, khi chiên lên vỏ ngoài giòn, bên trong dẻo thơm.',
        130000.00,
        119000.00,
        260,
        240,
        52,
        300,
        30,
        1,
        NULL,
        8
    ),
    (
        103,
        'Chả Ngan',
        'cha-ngan',
        'Chả ngan được làm từ thịt ngan tươi, xay nhuyễn và tẩm ướp gia vị, chiên vàng thơm nức, vị ngọt đậm đà.',
        240000.00,
        225000.00,
        150,
        138,
        29,
        170,
        15,
        1,
        4,
        9
    ),
    (
        104,
        'Ngan Một Nắng',
        'ngan-mot-nang',
        'Thịt ngan được tẩm ướp gia vị rồi phơi qua một nắng, thịt dẻo, đậm vị, chiên hoặc nướng đều rất ngon.',
        280000.00,
        260000.00,
        120,
        110,
        24,
        140,
        10,
        1,
        NULL,
        9
    ),
    (
        105,
        'Ngan Xông Khói',
        'ngan-xong-khoi',
        'Thịt ức ngan được tẩm ướp và xông khói theo quy trình nghiêm ngặt, thái lát mỏng ăn liền, hương vị hảo hạng.',
        320000.00,
        299000.00,
        140,
        130,
        28,
        150,
        15,
        1,
        3,
        9
    );

INSERT INTO
    CartItems (qty_total, price_total, user_id, product_id)
VALUES
    (1, 45000, 1, 1),
    (2, 56000, 1, 2),
    (1, 28000, 2, 3),
    (3, 330000, 3, 4),
    (5, 375000, 4, 6),
    (2, 170000, 4, 7),
    (10, 1100000, 5, 8),
    (3, 690000, 5, 9),
    (2, 130000, 2, 10);

INSERT INTO
    Discounts (
        name,
        description,
        value,
        min_price,
        start_date,
        end_date,
        status
    )
VALUES
    (
        'Giảm 10% mùa hè',
        'Áp dụng cho tất cả đặc sản mùa hè',
        10,
        100000,
        '2025-06-01 00:00:00',
        '2025-08-31 23:59:59',
        1
    ),
    (
        'Flash Sale 50k',
        'Giảm trực tiếp 50.000 VND cho đơn hàng đặc sản từ 500.000 VND',
        50000,
        500000,
        '2025-09-20 00:00:00',
        '2025-09-25 23:59:59',
        1
    ),
    (
        'Mua 1 tặng 1',
        'Chương trình mua 1 tặng 1 cho một số đặc sản chọn lọc',
        100,
        0,
        '2025-10-01 00:00:00',
        '2025-10-10 23:59:59',
        0
    ),
    (
        'Giảm 20% dịp lễ',
        'Khuyến mại 20% tất cả đặc sản dịp lễ',
        20,
        200000,
        '2025-12-20 00:00:00',
        '2025-12-31 23:59:59',
        1
    ),
    (
        'Free Ship 0đ',
        'Miễn phí vận chuyển cho đơn hàng đặc sản trên 300.000 VND',
        0,
        300000,
        '2025-09-01 00:00:00',
        '2025-09-30 23:59:59',
        1
    );

INSERT INTO
    DiscountProducts (discount_id, product_id)
VALUES
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

INSERT INTO
    Sliders (name, image_url, sort_order)
VALUES
    (
        'Khuyến mãi mùa hè',
        'https://via.placeholder.com/800x300?text=Summer+Sale',
        1
    ),
    (
        'Đặc sản bán chạy',
        'https://via.placeholder.com/800x300?text=Best+Sellers',
        2
    ),
    (
        'Mới ra mắt',
        'https://via.placeholder.com/800x300?text=New+Arrivals',
        3
    ),
    (
        'Ưu đãi cuối tuần',
        'https://via.placeholder.com/800x300?text=Weekend+Deals',
        4
    ),
    (
        'Sản phẩm nổi bật',
        'https://via.placeholder.com/800x300?text=Featured+Products',
        5
    );

INSERT INTO
    ProductImages (is_main, image_url, product_id)
VALUES
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/banh-pia-soc-trang/banh-pia-soc-trang-1.jpg',
        1
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/banh-pia-soc-trang/banh-pia-soc-trang-2.jpg',
        1
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/banh-pia-soc-trang/banh-pia-soc-trang-3.jpeg',
        1
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/banh-pia-soc-trang/banh-pia-soc-trang-ctpk.jpeg',
        1
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-1.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-2.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-3.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-4.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-5.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-6.jpg',
        2
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/bo-mot-nang-rong-pa/bo-mot-nang-rong-pa-ctpk.jpg',
        2
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ca-phe-buon-ma-thuot/ca-phe-buon-ma-thuot-1.jpg',
        3
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ca-phe-buon-ma-thuot/ca-phe-buon-ma-thuot-2.jpg',
        3
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ca-phe-buon-ma-thuot/ca-phe-buon-ma-thuot-3.jpg',
        3
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/ca-phe-buon-ma-thuot/ca-phe-buon-ma-thuot-ctpk.jpg',
        3
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-1.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-2.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-3.png',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-4.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-5.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-6.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-7.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-8.jpg',
        4
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/cha-oc-nua/cha-oc-nua-ctpk.jpg',
        4
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/de-chien-gion-tay-ninh/de-chien-gion-tay-ninh-1.jpg',
        5
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/de-chien-gion-tay-ninh/de-chien-gion-tay-ninh-2.jpg',
        5
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/de-chien-gion-tay-ninh/de-chien-gion-tay-ninh-3.jpg',
        5
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/de-chien-gion-tay-ninh/de-chien-gion-tay-ninh-ctpk.jpg',
        5
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/gan-bo-rau-tien-vua/gan-bo-rau-tien-vua-1.jpg',
        6
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/gan-bo-rau-tien-vua/gan-bo-rau-tien-vua-2.png',
        6
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/gan-bo-rau-tien-vua/gan-bo-rau-tien-vua-3.jpg',
        6
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/gan-bo-rau-tien-vua/gan-bo-rau-tien-vua-4.jpg',
        6
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/gan-bo-rau-tien-vua/gan-bo-rau-tien-vua-ctpk.jpeg',
        6
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/hat-dieu-rang-muoi-binh-phuoc/hat-dieu-rang-muoi-binh-phuoc-1.jpg',
        7
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/hat-dieu-rang-muoi-binh-phuoc/hat-dieu-rang-muoi-binh-phuoc-2.jpg',
        7
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/hat-dieu-rang-muoi-binh-phuoc/hat-dieu-rang-muoi-binh-phuoc-3.jpg',
        7
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/hat-dieu-rang-muoi-binh-phuoc/hat-dieu-rang-muoi-binh-phuoc-4.jpg',
        7
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/hat-dieu-rang-muoi-binh-phuoc/hat-dieu-rang-muoi-binh-phuoc-ctpk.jpg',
        7
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-1.png',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-2.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-3.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-4.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-5.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-6.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-7.jpg',
        8
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/mam-tep-chung-thit/mam-tep-chung-thit-ctpk.jpg',
        8
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mat-ong-rung-u-minh/mat-ong-rung-u-minh-1.jpg',
        9
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/mat-ong-rung-u-minh/mat-ong-rung-u-minh-2.jpg',
        9
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/mat-ong-rung-u-minh/mat-ong-rung-u-minh-ctpk.jpg',
        9
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/me-sung-hue/me-sung-hue-1.jpg',
        10
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/me-sung-hue/me-sung-hue-2.jpg',
        10
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/me-sung-hue/me-sung-hue-3.jpg',
        10
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/me-sung-hue/me-sung-hue-4.jpg',
        10
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/me-sung-hue/me-sung-hue-ctpk.jpg',
        10
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/moc-oc/moc-oc-1.jpg',
        11
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/moc-oc/moc-oc-2.jpg',
        11
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/moc-oc/moc-oc-ctpk.png',
        11
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ruou-can-tay-nguyen/ruou-can-tay-nguyen-1.jpg',
        12
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ruou-can-tay-nguyen/ruou-can-tay-nguyen-2.jpg',
        12
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ruou-can-tay-nguyen/ruou-can-tay-nguyen-3.jpg',
        12
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/ruou-can-tay-nguyen/ruou-can-tay-nguyen-4.jpg',
        12
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/ruou-can-tay-nguyen/ruou-can-tay-nguyen-ctpk.jpg',
        12
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-1.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-2.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-3.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-4.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-5.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-6.jpg',
        13
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/tra-sen-tay-ho/tra-sen-tay-ho-ctpk.jpg',
        13
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/trung-kien-tay-bac/trung-kien-tay-bac-1.jpg',
        14
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/trung-kien-tay-bac/trung-kien-tay-bac-2.jpg',
        14
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/trung-kien-tay-bac/trung-kien-tay-bac-3.jpg',
        14
    ),
    (
        0,
        'assets/image/shared/product/cac-thuc-pham-khac/trung-kien-tay-bac/trung-kien-tay-bac-4.jpg',
        14
    ),
    (
        1,
        'assets/image/shared/product/cac-thuc-pham-khac/trung-kien-tay-bac/trung-kien-tay-bac-ctpk.jpg',
        14
    ),
    (
        0,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-1.jpg',
        15
    ),
    (
        0,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-2.jpg',
        15
    ),
    (
        0,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-3.jpg',
        15
    ),
    (
        0,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-4.jpg',
        15
    ),
    (
        0,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-5.jpg',
        15
    ),
    (
        1,
        'assets/image/shared/product/hai-san/be-be-rang-muoi/be-be-rang-muoi-hs.jpg',
        15
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-bop-nau-me/ca-bop-nau-me-1.jpg',
        16
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-bop-nau-me/ca-bop-nau-me-2.jpg',
        16
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-bop-nau-me/ca-bop-nau-me-3.jpg',
        16
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-bop-nau-me/ca-bop-nau-me-4.jpg',
        16
    ),
    (
        1,
        'assets/image/shared/product/hai-san/ca-bop-nau-me/ca-bop-nau-me-hs.jpg',
        16
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-1.jpg',
        17
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-2.jpg',
        17
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-3.jpg',
        17
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-4.jpg',
        17
    ),
    (
        0,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-5.jpg',
        17
    ),
    (
        1,
        'assets/image/shared/product/hai-san/ca-linh-bong/ca-linh-bong-hs.jpg',
        17
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-mong/cha-ca-mong-1.png',
        18
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-mong/cha-ca-mong-2.jpg',
        18
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-mong/cha-ca-mong-3.jpg',
        18
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cha-ca-mong/cha-ca-mong-hs.jpg',
        18
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-muc-tom/cha-ca-muc-tom-1.png',
        19
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-muc-tom/cha-ca-muc-tom-2.jpg',
        19
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-ca-muc-tom/cha-ca-muc-tom-3.jpg',
        19
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cha-ca-muc-tom/cha-ca-muc-tom-hs.jpg',
        19
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-mo-ghe/cha-mo-ghe-1.jpg',
        20
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-mo-ghe/cha-mo-ghe-2.jpg',
        20
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-mo-ghe/cha-mo-ghe-3.jpg',
        20
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cha-mo-ghe/cha-mo-ghe-hs.jpg',
        20
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-1.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-2.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-3.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-4.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-5.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-6.png',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-7.png',
        21
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cha-muc-ha-long/cha-muc-ha-long-hs.jpg',
        21
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-tom/cha-tom-1.jpg',
        22
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-tom/cha-tom-2.jpg',
        22
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cha-tom/cha-tom-3.jpg',
        22
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cha-tom/cha-tom-hs.jpg',
        22
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-1.jpg',
        23
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-2.jpg',
        23
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-3.jpg',
        23
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-4.jpg',
        23
    ),
    (
        0,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-5.jpg',
        23
    ),
    (
        1,
        'assets/image/shared/product/hai-san/cua-ca-mau/cua-ca-mau-hs.jpg',
        23
    ),
    (
        0,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-1.jpg',
        24
    ),
    (
        0,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-2.jpg',
        24
    ),
    (
        0,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-3.jpg',
        24
    ),
    (
        0,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-4.jpg',
        24
    ),
    (
        0,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-5.jpg',
        24
    ),
    (
        1,
        'assets/image/shared/product/hai-san/goi-ca-trich/goi-ca-trich-hs.jpg',
        24
    ),
    (
        0,
        'assets/image/shared/product/hai-san/hau-nuong-mo-hanh/hau-nuong-mo-hanh-1.jpg',
        25
    ),
    (
        0,
        'assets/image/shared/product/hai-san/hau-nuong-mo-hanh/hau-nuong-mo-hanh-2.jpg',
        25
    ),
    (
        0,
        'assets/image/shared/product/hai-san/hau-nuong-mo-hanh/hau-nuong-mo-hanh-3.jpg',
        25
    ),
    (
        0,
        'assets/image/shared/product/hai-san/hau-nuong-mo-hanh/hau-nuong-mo-hanh-4.jpg',
        25
    ),
    (
        1,
        'assets/image/shared/product/hai-san/hau-nuong-mo-hanh/hau-nuong-mo-hanh-hs.jpg',
        25
    ),
    (
        0,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-1.jpg',
        26
    ),
    (
        0,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-2.jpg',
        26
    ),
    (
        0,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-3.jpg',
        26
    ),
    (
        0,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-4.jpg',
        26
    ),
    (
        0,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-5.png',
        26
    ),
    (
        1,
        'assets/image/shared/product/hai-san/muc-mot-nang/muc-mot-nang-hs.jpg',
        26
    ),
    (
        0,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-1.jpg',
        27
    ),
    (
        0,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-2.jpg',
        27
    ),
    (
        0,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-3.jpg',
        27
    ),
    (
        0,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-4.jpg',
        27
    ),
    (
        0,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-5.jpg',
        27
    ),
    (
        1,
        'assets/image/shared/product/hai-san/nem-hai-san/nem-hai-san-hs.jpg',
        27
    ),
    (
        0,
        'assets/image/shared/product/hai-san/sa-sung-nuong/sa-sung-nuong-1.jpg',
        28
    ),
    (
        0,
        'assets/image/shared/product/hai-san/sa-sung-nuong/sa-sung-nuong-2.jpg',
        28
    ),
    (
        0,
        'assets/image/shared/product/hai-san/sa-sung-nuong/sa-sung-nuong-3.jpg',
        28
    ),
    (
        1,
        'assets/image/shared/product/hai-san/sa-sung-nuong/sa-sung-nuong-hs.jpg',
        28
    ),
    (
        0,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-1.jpg',
        29
    ),
    (
        0,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-2.jpg',
        29
    ),
    (
        0,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-3.jpg',
        29
    ),
    (
        0,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-4.png',
        29
    ),
    (
        0,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-5.jpg',
        29
    ),
    (
        1,
        'assets/image/shared/product/hai-san/tom-su-bac-lieu/tom-su-bac-lieu-hs.jpg',
        29
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-be-be/ruoc-be-be-1.jpg',
        30
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-be-be/ruoc-be-be-2.jpg',
        30
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-be-be/ruoc-be-be-3.jpg',
        30
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-be-be/ruoc-be-be-r.jpg',
        30
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-basa/ruoc-ca-basa-1.jpg',
        31
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-basa/ruoc-ca-basa-2.jpg',
        31
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-basa/ruoc-ca-basa-3.jpg',
        31
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-ca-basa/ruoc-ca-basa-r.jpg',
        31
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-loc/ruoc-ca-loc-1.jpg',
        32
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-loc/ruoc-ca-loc-hs-2.jpg',
        32
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-loc/ruoc-ca-loc-hs-3.jpg',
        32
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-ca-loc/ruoc-ca-loc-r.jpg',
        32
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-1.jpg',
        33
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-2.jpg',
        33
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-3.jpg',
        33
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-4.jpg',
        33
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-5.jpg',
        33
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-ca-ro-dong/ruoc-ca-ro-dong-r.jpg',
        33
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-thu/ruoc-ca-thu-1.jpg',
        34
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-thu/ruoc-ca-thu-2.jpg',
        34
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-thu/ruoc-ca-thu-3.jpg',
        34
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-ca-thu/ruoc-ca-thu-4.jpg',
        34
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-ca-thu/ruoc-ca-thu-r.jpg',
        34
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-mam-hue/ruoc-mam-hue-1.jpg',
        35
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-mam-hue/ruoc-mam-hue-2.jpg',
        35
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-mam-hue/ruoc-mam-hue-3.jpg',
        35
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-mam-hue/ruoc-mam-hue-r.jpg',
        35
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tep-dong-thap/ruoc-tep-dong-thap-1.jpg',
        36
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tep-dong-thap/ruoc-tep-dong-thap-2.jpg',
        36
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tep-dong-thap/ruoc-tep-dong-thap-3.jpg',
        36
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-tep-dong-thap/ruoc-tep-dong-thap-r.jpg',
        36
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-1.jpg',
        37
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-2.jpg',
        37
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-3.jpg',
        37
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-4.jpg',
        37
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-5.jpg',
        37
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-thit-lon-nam-dinh/ruoc-thit-lon-nam-dinh-r.jpg',
        37
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-1.jpg',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-1.png',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-2.jpg',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-3.jpg',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-4.jpg',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-5.jpg',
        38
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-tom-binh-dinh/ruoc-tom-binh-dinh-r.jpg',
        38
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-dat-ca-mau/ruoc-tom-dat-ca-mau-1.jpg',
        39
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-dat-ca-mau/ruoc-tom-dat-ca-mau-2.jpg',
        39
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-tom-dat-ca-mau/ruoc-tom-dat-ca-mau-r.jpg',
        39
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-ha-long/ruoc-tom-ha-long-1.jpg',
        40
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-ha-long/ruoc-tom-ha-long-2.jpg',
        40
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-ha-long/ruoc-tom-ha-long-3.jpg',
        40
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-tom-ha-long/ruoc-tom-ha-long-r.jpg',
        40
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-rong-bien/ruoc-tom-rong-bien-1.jpg',
        41
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-rong-bien/ruoc-tom-rong-bien-2.jpg',
        41
    ),
    (
        0,
        'assets/image/shared/product/ruoc/ruoc-tom-rong-bien/ruoc-tom-rong-bien-3.jpg',
        41
    ),
    (
        1,
        'assets/image/shared/product/ruoc/ruoc-tom-rong-bien/ruoc-tom-rong-bien-r.jpg',
        41
    ),
    (
        0,
        'assets/image/shared/product/ga/da-ga-chien-gion/da-ga-chien-gion-1.jpg',
        42
    ),
    (
        0,
        'assets/image/shared/product/ga/da-ga-chien-gion/da-ga-chien-gion-2.jpg',
        42
    ),
    (
        1,
        'assets/image/shared/product/ga/da-ga-chien-gion/da-ga-chien-gion-g.png',
        42
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-chay-toi/ga-chay-toi-1.png',
        43
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-chay-toi/ga-chay-toi-2.jpg',
        43
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-chay-toi/ga-chay-toi-g.png',
        43
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-dong-tao-u-muoi/ga-dong-tao-u-muoi-1.jpg',
        44
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-dong-tao-u-muoi/ga-dong-tao-u-muoi-2.jpg',
        44
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-dong-tao-u-muoi/ga-dong-tao-u-muoi-g.png',
        44
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-muoi-ot/ga-nuong-muoi-ot-1.jpg',
        45
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-muoi-ot/ga-nuong-muoi-ot-2.jpg',
        45
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-muoi-ot/ga-nuong-muoi-ot-3.jpg',
        45
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-nuong-muoi-ot/ga-nuong-muoi-ot-g.jpg',
        45
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-thao-moc/ga-nuong-thao-moc-1.jpg',
        46
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-thao-moc/ga-nuong-thao-moc-2.jpg',
        46
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-nuong-thao-moc/ga-nuong-thao-moc-3.jpg',
        46
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-nuong-thao-moc/ga-nuong-thao-moc-g.jpg',
        46
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-muoi/ga-u-muoi-1.jpg',
        47
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-muoi/ga-u-muoi-2.jpg',
        47
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-muoi/ga-u-muoi-3.jpg',
        47
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-u-muoi/ga-u-muoi-g.jpg',
        47
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-xi-dau/ga-u-xi-dau-1.jpg',
        48
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-xi-dau/ga-u-xi-dau-2.jpg',
        48
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-u-xi-dau/ga-u-xi-dau-3.jpg',
        48
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-u-xi-dau/ga-u-xi-dau-g.jpg',
        48
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-vien-chien/ga-vien-chien-1.jpg',
        49
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-vien-chien/ga-vien-chien-2.jpg',
        49
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-vien-chien/ga-vien-chien-3.jpg',
        49
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-vien-chien/ga-vien-chien-g.jpg',
        49
    ),
    (
        0,
        'assets/image/shared/product/ga/ha-cao-ga/ha-cao-ga-1.jpg',
        50
    ),
    (
        0,
        'assets/image/shared/product/ga/ha-cao-ga/ha-cao-ga-2.jpg',
        50
    ),
    (
        1,
        'assets/image/shared/product/ga/ha-cao-ga/ha-cao-ga-g.jpg',
        50
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-kho-mam/ga-kho-mam-1.jpg',
        51
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-kho-mam/ga-kho-mam-2.jpg',
        51
    ),
    (
        0,
        'assets/image/shared/product/ga/ga-kho-mam/ga-kho-mam-3.jpg',
        51
    ),
    (
        1,
        'assets/image/shared/product/ga/ga-kho-mam/ga-kho-mam-g.jpg',
        51
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-hat-dieu/banh-hat-dieu-1.jpg',
        52
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-hat-dieu/banh-hat-dieu-2.jpg',
        52
    ),
    (
        1,
        'assets/image/shared/product/hat/banh-hat-dieu/banh-hat-dieu-h.jpg',
        52
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-thanh-hanh-nhan/banh-thanh-hanh-nhan-1.jpg',
        53
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-thanh-hanh-nhan/banh-thanh-hanh-nhan-2.jpg',
        53
    ),
    (
        1,
        'assets/image/shared/product/hat/banh-thanh-hanh-nhan/banh-thanh-hanh-nhan-h.jpg',
        53
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-thuyen-macca/banh-thuyen-macca-1.jpg',
        54
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-thuyen-macca/banh-thuyen-macca-2.jpg',
        54
    ),
    (
        0,
        'assets/image/shared/product/hat/banh-thuyen-macca/banh-thuyen-macca-3.jpg',
        54
    ),
    (
        1,
        'assets/image/shared/product/hat/banh-thuyen-macca/banh-thuyen-macca-h.jpg',
        54
    ),
    (
        0,
        'assets/image/shared/product/hat/hanh-nhan/hanh-nhan-1.png',
        55
    ),
    (
        0,
        'assets/image/shared/product/hat/hanh-nhan/hanh-nhan-2.jpg',
        55
    ),
    (
        1,
        'assets/image/shared/product/hat/hanh-nhan/hanh-nhan-h.jpg',
        55
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-dieu/hat-dieu-1.jpg',
        56
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-dieu/hat-dieu-2.jpg',
        56
    ),
    (
        1,
        'assets/image/shared/product/hat/hat-dieu/hat-dieu-h.png',
        56
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-macca/hat-macca-1.png',
        57
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-macca/hat-macca-2.png',
        57
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-macca/hat-macca-3.jpg',
        57
    ),
    (
        1,
        'assets/image/shared/product/hat/hat-macca/hat-macca-h.png',
        57
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-oc-cho/hat-oc-cho-1.jpg',
        58
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-oc-cho/hat-oc-cho-2.jpg',
        58
    ),
    (
        1,
        'assets/image/shared/product/hat/hat-oc-cho/hat-oc-cho-h.png',
        58
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-sen-say/hat-sen-say-1.png',
        59
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-sen-say/hat-sen-say-2.jpg',
        59
    ),
    (
        0,
        'assets/image/shared/product/hat/hat-sen-say/hat-sen-say-3.jpg',
        59
    ),
    (
        1,
        'assets/image/shared/product/hat/hat-sen-say/hat-sen-say-h.jpg',
        59
    ),
    (
        0,
        'assets/image/shared/product/hat/mix-5-loai-hat-dinh-duong/mix-5-loai-hat-dinh-duong-1.png',
        60
    ),
    (
        0,
        'assets/image/shared/product/hat/mix-5-loai-hat-dinh-duong/mix-5-loai-hat-dinh-duong-2.jpg',
        60
    ),
    (
        0,
        'assets/image/shared/product/hat/mix-5-loai-hat-dinh-duong/mix-5-loai-hat-dinh-duong-3.jpg',
        60
    ),
    (
        1,
        'assets/image/shared/product/hat/mix-5-loai-hat-dinh-duong/mix-5-loai-hat-dinh-duong-h.png',
        60
    ),
    (
        0,
        'assets/image/shared/product/hat/thanh-rong-bien-kep-hat/thanh-rong-bien-kep-hat-1.jpg',
        61
    ),
    (
        0,
        'assets/image/shared/product/hat/thanh-rong-bien-kep-hat/thanh-rong-bien-kep-hat-2.jpg',
        61
    ),
    (
        0,
        'assets/image/shared/product/hat/thanh-rong-bien-kep-hat/thanh-rong-bien-kep-hat-3.jpg',
        61
    ),
    (
        1,
        'assets/image/shared/product/hat/thanh-rong-bien-kep-hat/thanh-rong-bien-kep-hat-h.jpg',
        61
    ),
    (
        0,
        'assets/image/shared/product/vit/cha-chan-vit/cha-chan-vit-1.png',
        62
    ),
    (
        0,
        'assets/image/shared/product/vit/cha-chan-vit/cha-chan-vit-2.png',
        62
    ),
    (
        0,
        'assets/image/shared/product/vit/cha-chan-vit/cha-chan-vit-3.png',
        62
    ),
    (
        1,
        'assets/image/shared/product/vit/cha-chan-vit/cha-chan-vit-v.png',
        62
    ),
    (
        0,
        'assets/image/shared/product/vit/cha-vit-thuy-manh/cha-vit-thuy-hanh-2.png',
        63
    ),
    (
        0,
        'assets/image/shared/product/vit/cha-vit-thuy-manh/cha-vit-thuy-manh-1.png',
        63
    ),
    (
        1,
        'assets/image/shared/product/vit/cha-vit-thuy-manh/cha-vit-thuy-manh-v.jpg',
        63
    ),
    (
        0,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-muoi/chan-vit-rut-xuong-u-muoi-1.jpg',
        64
    ),
    (
        0,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-muoi/chan-vit-rut-xuong-u-muoi-2.jpg',
        64
    ),
    (
        0,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-muoi/chan-vit-rut-xuong-u-muoi-3.jpg',
        64
    ),
    (
        1,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-muoi/chan-vit-rut-xuong-u-muoi-v.jpg',
        64
    ),
    (
        0,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-xi-dau/chan-vit-rut-xuong-u-xi-dau-1.jpg',
        65
    ),
    (
        0,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-xi-dau/chan-vit-rut-xuong-u-xi-dau-2.jpg',
        65
    ),
    (
        1,
        'assets/image/shared/product/vit/chan-vit-rut-xuong-u-xi-dau/chan-vit-rut-xuong-u-xi-dau-v.jpg',
        65
    ),
    (
        0,
        'assets/image/shared/product/vit/moc-vit/moc-vit-1.png',
        66
    ),
    (
        0,
        'assets/image/shared/product/vit/moc-vit/moc-vit-2.png',
        66
    ),
    (
        0,
        'assets/image/shared/product/vit/moc-vit/moc-vit-3.png',
        66
    ),
    (
        1,
        'assets/image/shared/product/vit/moc-vit/moc-vit-v.png',
        66
    ),
    (
        0,
        'assets/image/shared/product/vit/pate-gan-vit/pate-gan-vit-1.png',
        67
    ),
    (
        0,
        'assets/image/shared/product/vit/pate-gan-vit/pate-gan-vit-2.png',
        67
    ),
    (
        1,
        'assets/image/shared/product/vit/pate-gan-vit/pate-gan-vit-v.jpg',
        67
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-quay/vit-quay-1.jpg',
        68
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-quay/vit-quay-2.jpg',
        68
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-quay/vit-quay-3.jpg',
        68
    ),
    (
        1,
        'assets/image/shared/product/vit/vit-quay/vit-quay-v.jpg',
        68
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-tiem-hat-sen/vit-tiem-hat-sen-1.jpg',
        69
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-tiem-hat-sen/vit-tiem-hat-sen-2.jpg',
        69
    ),
    (
        1,
        'assets/image/shared/product/vit/vit-tiem-hat-sen/vit-tiem-hat-sen-v.jpg',
        69
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-u-xi-dau/vit-u-xi-dau-1.png',
        70
    ),
    (
        0,
        'assets/image/shared/product/vit/vit-u-xi-dau/vit-u-xi-dau-2.png',
        70
    ),
    (
        1,
        'assets/image/shared/product/vit/vit-u-xi-dau/vit-u-xi-dau-v.png',
        70
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-1.jpg',
        71
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-2.jpg',
        71
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-3.jpeg',
        71
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-4.jpeg',
        71
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-5.jpg',
        71
    ),
    (
        1,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi/cha-ca-thac-lac-tuoi-c.jpg',
        71
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-chien-tam-gia-vi-say-kho/ca-chien-tam-gia-vi-say-kho-1.jpg',
        72
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-chien-tam-gia-vi-say-kho/ca-chien-tam-gia-vi-say-kho-2.jpg',
        72
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-chien-tam-gia-vi-say-kho/ca-chien-tam-gia-vi-say-kho-c.jpg',
        72
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-chua-ngot-dong-hu/ca-chua-ngot-dong-hu-c.jpg',
        73
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-hop/ca-hop-c.jpg',
        74
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-kho/ca-kho-1.jpg',
        75
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-kho/ca-kho-2.jpg',
        75
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-kho/ca-kho-3.jpg',
        75
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-kho/ca-kho-c.jpg',
        75
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-loc-rim-me/ca-loc-rim-me-1.jpg',
        76
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-loc-rim-me/ca-loc-rim-me-2.jpg',
        76
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-loc-rim-me/ca-loc-rim-me-c.jpg',
        76
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-mot-nang/ca-mot-nang-2.jpg',
        77
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-mot-nang/ca-mot-nang-c.png',
        77
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-mot-nang/ca-mot-nang-1.jpg',
        77
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-muc-mot-nang-tam-gia-vi/ca-muc-mot-nang-tam-gia-vi-c.jpg',
        78
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-muc-mot-nang-tam-gia-vi/ca-muc-mot-nang-tam-gia-vi-1.jpg',
        78
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-rim/ca-rim-1.jpg',
        79
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-rim/ca-rim-2.jpg',
        79
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-rim/ca-rim-3.jpg',
        79
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-rim/ca-rim-c.jpg',
        79
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-ro-phi-say-gion/ca-ro-phi-say-gion-1.jpg',
        80
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-ro-phi-say-gion/ca-ro-phi-say-gion-2.jpg',
        80
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-ro-phi-say-gion/ca-ro-phi-say-gion-c.jpg',
        80
    ),
    (
        0,
        'assets/image/shared/product/ca/ca-thu-rim-toi-ot/ca-thu-rim-toi-ot-1.jpg',
        81
    ),
    (
        1,
        'assets/image/shared/product/ca/ca-thu-rim-toi-ot/ca-thu-rim-toi-ot-c.jpg',
        81
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-hau-giang/cha-ca-thac-lac-hau-giang-1.jpg',
        82
    ),
    (
        1,
        'assets/image/shared/product/ca/cha-ca-thac-lac-hau-giang/cha-ca-thac-lac-hau-giang-c.jpg',
        82
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi-tam-gia-vi/cha-ca-thac-lac-tuoi-tam-gia-vi-1.jpg',
        83
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi-tam-gia-vi/cha-ca-thac-lac-tuoi-tam-gia-vi-2.jpg',
        83
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi-tam-gia-vi/cha-ca-thac-lac-tuoi-tam-gia-vi-3.jpg',
        83
    ),
    (
        0,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi-tam-gia-vi/cha-ca-thac-lac-tuoi-tam-gia-vi-5.jpg',
        83
    ),
    (
        1,
        'assets/image/shared/product/ca/cha-ca-thac-lac-tuoi-tam-gia-vi/cha-ca-thac-lac-tuoi-tam-gia-vi-c.jpg',
        83
    ),
    (
        0,
        'assets/image/shared/product/ca/pa-te-ca-hoi-ha-long/pa-te-ca-hoi-ha-long-1.jpg',
        84
    ),
    (
        1,
        'assets/image/shared/product/ca/pa-te-ca-hoi-ha-long/pa-te-ca-hoi-ha-long-c.jpg',
        84
    ),
    (
        0,
        'assets/image/shared/product/heo/cha-gio-cha-lua/cha-gio-cha-lua-1.jpg',
        85
    ),
    (
        1,
        'assets/image/shared/product/heo/cha-gio-cha-lua/cha-gio-cha-lua-h.jpg',
        85
    ),
    (
        0,
        'assets/image/shared/product/heo/chan-gio-gia-cay/chan-gio-gia-cay-1.jpg',
        86
    ),
    (
        1,
        'assets/image/shared/product/heo/chan-gio-gia-cay/chan-gio-gia-cay-h.jpg',
        86
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-chia-hai-phong/dac-san-cha-chia-hai-phong-1.jpg',
        87
    ),
    (
        1,
        'assets/image/shared/product/heo/dac-san-cha-chia-hai-phong/dac-san-cha-chia-hai-phong-h.jpg',
        87
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-1.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-2.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-3.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-4.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-5.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-6.jpg',
        88
    ),
    (
        1,
        'assets/image/shared/product/heo/dac-san-cha-com-ha-noi/dac-san-cha-com-ha-noi-h.jpg',
        88
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-sun/dac-san-cha-sun-1.jpg',
        89
    ),
    (
        0,
        'assets/image/shared/product/heo/dac-san-cha-sun/dac-san-cha-sun-2.jpg',
        89
    ),
    (
        1,
        'assets/image/shared/product/heo/dac-san-cha-sun/dac-san-cha-sun-h.jpg',
        89
    ),
    (
        0,
        'assets/image/shared/product/heo/khau-nhuc-lang-son/khau-nhuc-lang-son-1.png',
        90
    ),
    (
        0,
        'assets/image/shared/product/heo/khau-nhuc-lang-son/khau-nhuc-lang-son-2.png',
        90
    ),
    (
        1,
        'assets/image/shared/product/heo/khau-nhuc-lang-son/khau-nhuc-lang-son-h.jpg',
        90
    ),
    (
        0,
        'assets/image/shared/product/heo/mam-heo/mam-heo-1.jpg',
        91
    ),
    (
        1,
        'assets/image/shared/product/heo/mam-heo/mam-heo-h.jpg',
        91
    ),
    (
        0,
        'assets/image/shared/product/heo/nem-chua/nem-chua-1.jpg',
        92
    ),
    (
        1,
        'assets/image/shared/product/heo/nem-chua/nem-chua-h.jpg',
        92
    ),
    (
        0,
        'assets/image/shared/product/heo/nem-ha-noi/nem-ha-noi-1.jpg',
        93
    ),
    (
        0,
        'assets/image/shared/product/heo/nem-ha-noi/nem-ha-noi-2.jpg',
        93
    ),
    (
        0,
        'assets/image/shared/product/heo/nem-ha-noi/nem-ha-noi-3.jpg',
        93
    ),
    (
        1,
        'assets/image/shared/product/heo/nem-ha-noi/nem-ha-noi-h.jpg',
        93
    ),
    (
        0,
        'assets/image/shared/product/heo/nem-lui-nha-trang/nem-lui-nha-trang-3.jpg',
        94
    ),
    (
        1,
        'assets/image/shared/product/heo/nem-lui-nha-trang/nem-lui-nha-trang-h.jpg',
        94
    ),
    (
        1,
        'assets/image/shared/product/heo/pa-te-gan-heo/pa-te-gan-heo-h.jpg',
        95
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-1.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-2.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-3.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-4.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-5.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-6.jpg',
        96
    ),
    (
        1,
        'assets/image/shared/product/heo/tai-heo-cuon-luoi/tai-heo-cuon-luoi-h.jpg',
        96
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-u-muoi/tai-heo-u-muoi-1.png',
        97
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-u-muoi/tai-heo-u-muoi-2.jpg',
        97
    ),
    (
        1,
        'assets/image/shared/product/heo/tai-heo-u-muoi/tai-heo-u-muoi-h.jpg',
        97
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-u-xi-dau/tai-heo-u-xi-dau-1.jpg',
        98
    ),
    (
        0,
        'assets/image/shared/product/heo/tai-heo-u-xi-dau/tai-heo-u-xi-dau-2.jpg',
        98
    ),
    (
        1,
        'assets/image/shared/product/heo/tai-heo-u-xi-dau/tai-heo-u-xi-dau-h.jpeg',
        98
    ),
    (
        0,
        'assets/image/shared/product/heo/thit-chung-mam-tep/thit-chung-mam-tep-1.jpg',
        99
    ),
    (
        0,
        'assets/image/shared/product/heo/thit-chung-mam-tep/thit-chung-mam-tep-2.jpg',
        99
    ),
    (
        1,
        'assets/image/shared/product/heo/thit-chung-mam-tep/thit-chung-mam-tep-h.jpg',
        99
    ),
    (
        0,
        'assets/image/shared/product/heo/thit-heo-say-kho/thit-heo-say-kho-1.jpg',
        100
    ),
    (
        0,
        'assets/image/shared/product/heo/thit-heo-say-kho/thit-heo-say-kho-2.jpg',
        100
    ),
    (
        1,
        'assets/image/shared/product/heo/thit-heo-say-kho/thit-heo-say-kho-h.jpg',
        100
    ),
    (
        0,
        'assets/image/shared/product/heo/thit-heo-xong-khoi/thit-heo-xong-khoi-1.png',
        101
    ),
    (
        1,
        'assets/image/shared/product/heo/thit-heo-xong-khoi/thit-heo-xong-khoi-h.jpg',
        101
    ),
    (
        0,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-1.jpg',
        102
    ),
    (
        0,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-2.jpg',
        102
    ),
    (
        0,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-3.jpg',
        102
    ),
    (
        0,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-4.jpg',
        102
    ),
    (
        0,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-5.jpg',
        102
    ),
    (
        1,
        'assets/image/shared/product/heo/xuc-xich-com/xuc-xich-com-h.jpg',
        102
    ),
    (
        0,
        'assets/image/shared/product/ngan/cha-ngan/cha-ngan-1.jpg',
        103
    ),
    (
        0,
        'assets/image/shared/product/ngan/cha-ngan/cha-ngan-2.jpg',
        103
    ),
    (
        0,
        'assets/image/shared/product/ngan/cha-ngan/cha-ngan-3.jpg',
        103
    ),
    (
        1,
        'assets/image/shared/product/ngan/cha-ngan/cha-ngan-n.jpg',
        103
    ),
    (
        1,
        'assets/image/shared/product/ngan/ngan-mot-nang/bo-kho-mot-nang-n.jpg',
        104
    ),
    (
        0,
        'assets/image/shared/product/ngan/ngan-mot-nang/ngan-mot-nang-1.jpg',
        104
    ),
    (
        0,
        'assets/image/shared/product/ngan/ngan-xong-khoi/ngan-xong-khoi-1.jpg',
        105
    ),
    (
        1,
        'assets/image/shared/product/ngan/ngan-xong-khoi/ngan-xong-khoi-n.jpg',
        105
    );

INSERT INTO
    Comments (
        rate,
        content,
        product_id,
        user_id,
        created_at,
        updated_at
    )
VALUES
    (
        5,
        'Bánh pía Sóc Trăng ngon tuyệt, nhân sầu riêng thơm lừng, béo ngậy. Sẽ ủng hộ shop dài dài.',
        1,
        1,
        '2025-09-20 10:15:00',
        '2025-09-20 10:15:00'
    ),
    (
        4,
        'Bò một nắng Krông Pa thịt mềm, tẩm ướp đậm đà, rất hợp khẩu vị. Chấm với muối kiến vàng là hết sảy.',
        2,
        2,
        '2025-09-21 12:30:00',
        '2025-09-21 12:30:00'
    ),
    (
        3,
        'Cà phê Buôn Ma Thuột thơm, nhưng vị hơi gắt so với gu của mình. Nói chung là ổn.',
        3,
        3,
        '2025-09-22 14:00:00',
        '2025-09-22 14:00:00'
    ),
    (
        5,
        'Chả ốc dai giòn sần sật, thơm mùi lá lốt. Chấm tương ớt ăn cực cuốn, rất ngon!',
        4,
        4,
        '2025-09-23 16:45:00',
        '2025-09-23 16:45:00'
    ),
    (
        4,
        'Dê chiên giòn Tây Ninh thơm, lớp vỏ giòn rụm nhưng thịt bên trong không bị khô. Ăn khá ổn.',
        5,
        5,
        '2025-09-24 09:20:00',
        '2025-09-24 09:20:00'
    ),
    (
        2,
        'Món gân bò rau tiến vua hơi mặn so với mong đợi của mình. Gân bò thì giòn nhưng nước sốt cần điều chỉnh lại.',
        6,
        1,
        '2025-09-25 11:10:00',
        '2025-09-25 11:10:00'
    ),
    (
        5,
        'Hạt điều rang muối Bình Phước hạt to, giòn rụm, béo ngậy. Ăn cực đã, không bị hôi dầu.',
        7,
        2,
        '2025-09-26 13:35:00',
        '2025-09-26 13:35:00'
    ),
    (
        4,
        'Mắm tép chưng thịt đậm đà, thơm mùi riềng, ăn với cơm trắng rất tốn cơm. Giao hàng nhanh.',
        8,
        3,
        '2025-09-27 15:00:00',
        '2025-09-27 15:00:00'
    ),
    (
        3,
        'Mật ong rừng U Minh hơi đặc, nhưng có mùi thơm tràm đặc trưng. Vẫn ok.',
        9,
        4,
        '2025-09-27 16:20:00',
        '2025-09-27 16:20:00'
    ),
    (
        5,
        'Mè xửng Huế dẻo thơm, ngọt vừa phải, đậu phộng giòn bùi. Đúng chuẩn hương vị Huế, rất ngon.',
        10,
        5,
        '2025-09-27 17:45:00',
        '2025-09-27 17:45:00'
    ),
    (
        5,
        'Chả mực Hạ Long giã tay dai giòn sần sật, thơm nức. Đắt nhưng xắt ra miếng, chất lượng tuyệt vời.',
        21,
        6,
        '2025-09-28 09:05:00',
        '2025-09-28 09:05:00'
    ),
    (
        4,
        'Bề bề rang muối đậm đà, vỏ giòn. Thịt tươi ngọt nhưng hơi ít.',
        15,
        7,
        '2025-09-28 10:10:00',
        '2025-09-28 10:10:00'
    ),
    (
        5,
        'Nem chua Thanh Hóa chuẩn vị, chua cay vừa phải, thơm mùi tỏi ớt và lá ổi. Sẽ mua lại.',
        92,
        8,
        '2025-09-28 11:25:00',
        '2025-09-28 11:25:00'
    ),
    (
        4,
        'Chả cốm Hà Nội dẻo thơm, cảm nhận được hạt cốm bên trong. Chiên lên ăn nóng rất ngon.',
        88,
        9,
        '2025-09-28 14:00:00',
        '2025-09-28 14:00:00'
    ),
    (
        5,
        'Hạt điều to, đều, không bị vỡ. Rang muối vừa miệng, bùi và béo. Đóng gói cẩn thận.',
        56,
        10,
        '2025-09-29 08:30:00',
        '2025-09-29 08:30:00'
    ),
    (
        5,
        'Cua Cà Mau chắc thịt, gạch đầy ụ. Shop giao hàng sống, cua rất khỏe và tươi. Rất hài lòng.',
        23,
        1,
        '2025-09-29 12:00:00',
        '2025-09-29 12:00:00'
    ),
    (
        3,
        'Gà ủ muối da giòn, thịt dai nhưng hơi nhạt so với khẩu vị của gia đình mình.',
        47,
        2,
        '2025-09-29 15:45:00',
        '2025-09-29 15:45:00'
    ),
    (
        5,
        'Ruốc thịt lợn sợi bông, tơi, vàng ươm và rất thơm. Bé nhà mình rất thích ăn với cháo.',
        37,
        3,
        '2025-09-30 09:50:00',
        '2025-09-30 09:50:00'
    ),
    (
        4,
        'Vịt quay da giòn, thịt mềm, tẩm ướp vừa phải. Nước chấm đi kèm cũng khá ngon.',
        68,
        4,
        '2025-09-30 11:00:00',
        '2025-09-30 11:00:00'
    ),
    (
        4,
        'Thịt heo sấy khô đậm đà vị mắc khén, cay cay ngọt ngọt. Nhâm nhi xem phim là hết bài.',
        100,
        5,
        '2025-09-30 16:20:00',
        '2025-09-30 16:20:00'
    ),
    (
        5,
        'Nem hải sản vỏ giòn tan, nhân bên trong béo ngậy vị mayonnaise và hải sản. Rất đáng thử!',
        27,
        6,
        '2025-10-01 10:30:00',
        '2025-10-01 10:30:00'
    ),
    (
        5,
        'Trà sen Tây Hồ thơm dịu, vị thanh khiết. Uống một tách trà vào buổi sáng cảm thấy rất thư thái.',
        13,
        7,
        '2025-10-01 13:00:00',
        '2025-10-01 13:00:00'
    ),
    (
        4,
        'Hạt Macca sấy nứt vỏ dễ tách, hạt to tròn, ăn béo và thơm. Chất lượng tốt.',
        57,
        8,
        '2025-10-02 11:15:00',
        '2025-10-02 11:15:00'
    ),
    (
        4,
        'Pate gan vịt béo ngậy, mềm mịn, thơm mùi đặc trưng. Ăn kèm bánh mì nướng là tuyệt vời.',
        67,
        9,
        '2025-10-02 14:40:00',
        '2025-10-02 14:40:00'
    ),
    (
        5,
        'Chả cá thác lác Hậu Giang dai ngon, thơm mùi thì là. Nấu lẩu hay chiên đều ngon.',
        82,
        10,
        '2025-10-03 09:00:00',
        '2025-10-03 09:00:00'
    );

INSERT INTO
    Payments (METHOD, status)
VALUES
    ('COD', 1),
    ('CreditCard', 1),
    ('Momo', 1),
    ('VNPay', 0),
    ('ZaloPay', 1),
    ('Paypal', 0);

INSERT INTO
    Shipments (name, description, base_fee, status)
VALUES
    (
        'GHN',
        'Giao Hàng Nhanh, giao trong 1-2 ngày nội thành',
        20000,
        1
    ),
    (
        'GHTK',
        'Giao Hàng Tiết Kiệm, chi phí thấp, giao trong 2-3 ngày',
        15000,
        1
    ),
    (
        'Viettel Post',
        'Viettel Post, giao hàng toàn quốc',
        25000,
        1
    ),
    (
        'J&T Express',
        'Giao hàng nhanh, phù hợp nội thành và ngoại thành',
        22000,
        1
    ),
    (
        'Ninja Van',
        'Dịch vụ vận chuyển quốc tế và nội địa',
        30000,
        0
    );

INSERT INTO
    Transactions (
        status,
        deli_name,
        deli_phone,
        deli_address,
        deli_city,
        deli_district,
        deli_ward,
        message,
        tracking_number,
        shipping_fee,
        shipment_status,
        amount,
        shipped_at,
        delivered_at,
        user_id,
        payment_id,
        shipment_id
    )
VALUES
    (
        0,
        'Nguyen Van A',
        '0901234567',
        '123 Le Loi',
        'Ho Chi Minh',
        'Quan 1',
        'Phuong Ben Nghe',
        'Giao giờ hành chính',
        'TRK00001',
        20000,
        'pending',
        33020000,
        NULL,
        NULL,
        1,
        1,
        1
    ),
    (
        1,
        'Tran Thi B',
        '0902345678',
        '456 Nguyen Trai',
        'Ho Chi Minh',
        'Quan 3',
        'Phuong 5',
        'Để hàng ở bảo vệ',
        'TRK00002',
        15000,
        'shipped',
        29515000,
        '2025-09-22 10:00:00',
        NULL,
        2,
        2,
        2
    ),
    (
        4,
        'Le Van C',
        '0903456789',
        '789 Tran Hung Dao',
        'Ho Chi Minh',
        'Quan 5',
        'Phuong 10',
        'Giao nhanh nếu có thể',
        'TRK00003',
        22000,
        'delivered',
        21522000,
        '2025-09-23 09:00:00',
        '2025-09-24 14:00:00',
        3,
        3,
        3
    ),
    (
        2,
        'Pham Thi D',
        '0904567890',
        '1010 Cach Mang Thang 8',
        'Ho Chi Minh',
        'Quan Binh Thanh',
        'Phuong 12',
        'Không cần gọi điện',
        'TRK00004',
        25000,
        'returned',
        5500000,
        '2025-09-24 11:00:00',
        NULL,
        4,
        4,
        4
    ),
    (
        4,
        'Hoang Van E',
        '0905678901',
        '2020 Dien Bien Phu',
        'Ho Chi Minh',
        'Quan Tan Binh',
        'Phuong 15',
        'Giao ngoài giờ hành chính',
        'TRK00005',
        30000,
        'delivered',
        28030000,
        '2025-09-25 13:00:00',
        '2025-09-26 16:00:00',
        5,
        5,
        1
    ),
    (
        1,
        'Nguyen Van A',
        '0901234567',
        '123 Le Loi',
        'Ho Chi Minh',
        'Quan 1',
        'Phuong Ben Nghe',
        'Đóng gói cẩn thận',
        'TRK00006',
        15000,
        'shipped',
        11015000,
        '2025-09-26 08:00:00',
        NULL,
        1,
        2,
        2
    ),
    (
        0,
        'Tran Thi B',
        '0902345678',
        '456 Nguyen Trai',
        'Ho Chi Minh',
        'Quan 3',
        'Phuong 5',
        'Giao tại cửa',
        'TRK00007',
        20000,
        'pending',
        1202000,
        NULL,
        NULL,
        2,
        1,
        3
    ),
    (
        4,
        'Le Van C',
        '0903456789',
        '789 Tran Hung Dao',
        'Ho Chi Minh',
        'Quan 5',
        'Phuong 10',
        'Nhận hàng tại văn phòng',
        'TRK00008',
        25000,
        'delivered',
        64525000,
        '2025-09-22 14:00:00',
        '2025-09-23 17:00:00',
        3,
        3,
        4
    ),
    (
        1,
        'Pham Thi D',
        '0904567890',
        '1010 Cach Mang Thang 8',
        'Ho Chi Minh',
        'Quan Binh Thanh',
        'Phuong 12',
        'Giao vào buổi sáng',
        'TRK00009',
        22000,
        'shipped',
        4202200,
        '2025-09-25 09:30:00',
        NULL,
        4,
        2,
        5
    ),
    (
        4,
        'Hoang Van E',
        '0905678901',
        '2020 Dien Bien Phu',
        'Ho Chi Minh',
        'Quan Tan Binh',
        'Phuong 15',
        'Hàng fragile, cẩn thận',
        'TRK00010',
        30000,
        'delivered',
        7503000,
        '2025-09-24 13:00:00',
        '2025-09-25 15:00:00',
        5,
        5,
        1
    );

INSERT INTO
    OrderItems (
        qty_total,
        amount_total,
        transaction_id,
        product_id
    )
VALUES
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

INSERT INTO
    Boards (title, slug)
VALUES
    ('My First Board', 'my-first-board'),
    ('Project Ideas', 'project-ideas'),
    ('Team Discussions', 'team-discussions');