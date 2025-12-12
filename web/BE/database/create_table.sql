DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Shipments;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS AIFeedback;
DROP TABLE IF EXISTS CommentReactions;
DROP TABLE IF EXISTS CommentImages;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS ProductImages;
DROP TABLE IF EXISTS Sliders;
DROP TABLE IF EXISTS DiscountProducts;
DROP TABLE IF EXISTS Discounts;
DROP TABLE IF EXISTS CartItems;
DROP TABLE IF EXISTS CouponScopes;
DROP TABLE IF EXISTS Coupons;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS OtpCodes;
DROP TABLE IF EXISTS Tokens;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS PostCategories;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS PostImages;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS PostTypes;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Roles;

SET GLOBAL event_scheduler = ON;

-- Roles
CREATE TABLE 
    Roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- PostTypes
CREATE TABLE 
    PostTypes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,        -- tên loại bài viết
    slug VARCHAR(255) NOT NULL UNIQUE,        -- slug dùng query
    description VARCHAR(255) DEFAULT NULL,    -- mô tả ngắn
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts
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
    post_type_id INT UNSIGNED NULL,
    CONSTRAINT fk_posts_admin FOREIGN KEY (admin_id) REFERENCES Admins (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_posts_post_type FOREIGN KEY (post_type_id) REFERENCES PostTypes(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PostImages
CREATE TABLE 
    PostImages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main TINYINT(1) NOT NULL DEFAULT 0,
    display_order INT UNSIGNED DEFAULT 0,
    caption VARCHAR(255) DEFAULT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_postimages_post FOREIGN KEY (post_id) REFERENCES Posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_postimages_post (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories (self-relation)
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

-- PostCategories
CREATE TABLE
    PostCategories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        category_id INT UNSIGNED NULL,
        post_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_postcategories_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_postcategories_post FOREIGN KEY (post_id) REFERENCES Posts (id) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Users
CREATE TABLE 
    Users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NULL,
    password_hash VARCHAR(255) NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'local',
    provider_id VARCHAR(255) NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    phone VARCHAR(20) UNIQUE NULL,
    phone_verified TINYINT(1) NOT NULL DEFAULT 0,
    full_name VARCHAR(100) NULL,
    gender ENUM('male','female','other') NOT NULL DEFAULT 'other',
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    ward VARCHAR(100) NULL,
    avatar_url VARCHAR(255) NULL,
    status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_provider (provider),
    INDEX idx_users_provider_id (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OtpCodes
CREATE TABLE 
    OtpCodes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    code VARCHAR(10) NOT NULL,
    type ENUM('login', 'change_password', 'verify_email') NOT NULL DEFAULT 'login' COMMENT 'login: đăng nhập, change_password: đổi mật khẩu, verify_email: xác thực email',
    is_used TINYINT(1) NOT NULL DEFAULT 0,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE EVENT IF NOT EXISTS delete_expired_otps
ON SCHEDULE EVERY 5 MINUTE
DO
    DELETE FROM OtpCodes
    WHERE expires_at < NOW();

-- Tokens
CREATE TABLE 
    Tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    refresh_token VARCHAR(1024) UNIQUE NOT NULL,
    device_info VARCHAR(255) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    token_started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    token_expired_at DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_tokens_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 DAY
DO
    DELETE FROM Tokens
    WHERE token_expired_at < NOW() OR is_revoked = TRUE;

-- Products
CREATE TABLE 
    Products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    origin_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    import_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
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
    CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) 
        REFERENCES Categories (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    INDEX idx_products_category (category_id),
    INDEX idx_products_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Coupons
CREATE TABLE 
    Coupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    type TINYINT NOT NULL COMMENT '0: Giảm phí ship, 1: Giảm giá sản phẩm',
    value DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT '1–100: %, >100: VND',
    max_value DECIMAL(12, 2) NULL COMMENT 'Giới hạn giảm tối đa (nếu measure = 1)',
    min_order_value DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Giá trị đơn tối thiểu để áp dụng',
    quantity INT UNSIGNED DEFAULT 0 COMMENT 'Số lượng mã phát hành',
    used_count INT UNSIGNED DEFAULT 0 COMMENT 'Số lần đã sử dụng',
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '0: Ẩn, 1: Hoạt động, 2: Hết hạn, 3: Hủy',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CouponScopes
CREATE TABLE 
    CouponScopes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT UNSIGNED NOT NULL,
    scope_type TINYINT NOT NULL COMMENT '0: Toàn shop, 1: Theo sản phẩm',
    product_id INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES Coupons (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_coupon_scope_type (scope_type),
    INDEX idx_coupon_scope_coupon (coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CartItems
CREATE TABLE
    CartItems (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        qty_total INT UNSIGNED NOT NULL,
        price_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_id INT UNSIGNED NULL,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_cartitems_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_cartitems_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Discounts
CREATE TABLE
    Discounts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status TINYINT (1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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

-- Sliders
CREATE TABLE 
    Sliders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Tên slider/banner',
    description VARCHAR(255) NULL COMMENT 'Mô tả ngắn về banner',
    image_url VARCHAR(255) NOT NULL COMMENT 'Đường dẫn ảnh banner',
    link_url VARCHAR(255) NULL COMMENT 'Liên kết khi click vào banner',
    sort_order INT(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị, nhỏ hơn thì hiển thị trước',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '0: Ẩn, 1: Hiển thị',
    start_date DATETIME NULL COMMENT 'Ngày bắt đầu hiển thị banner',
    end_date DATETIME NULL COMMENT 'Ngày kết thúc hiển thị banner',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slider_status (status),
    INDEX idx_slider_sort (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ProductImages
CREATE TABLE
    ProductImages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        is_main TINYINT (1) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        product_id INT UNSIGNED NOT NULL,
        CONSTRAINT fk_productimages_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_productimages_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Comments
CREATE TABLE 
    Comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rate TINYINT(1) NOT NULL,
    content TEXT NOT NULL,
    likes INT UNSIGNED NOT NULL DEFAULT 0,
    dislikes INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CommentImages
CREATE TABLE 
    CommentImages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_images_comment FOREIGN KEY (comment_id) REFERENCES Comments (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AIFeedback
CREATE TABLE 
    AIFeedback (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    voter_id INT UNSIGNED DEFAULT NULL,         -- NULL nếu người vote không phải user
    vote TINYINT NOT NULL,        -- 1 = like, 0 = dislike
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CommentReactions
CREATE TABLE 
    CommentReactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    comment_id INT UNSIGNED NOT NULL,
    reaction ENUM('like', 'dislike') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_comment (user_id, comment_id, product_id),
    CONSTRAINT fk_comments_reaction_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comment_reactions_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comment_reactions_comment FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Payments
CREATE TABLE
    Payments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(50) NOT NULL, -- COD, CreditCard, Momo, VNPay, ...
    status TINYINT (1) NOT NULL,
    icon_url VARCHAR(255) DEFAULT NULL COMMENT 'đường dẫn ảnh icon',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payments_method (method),
    INDEX idx_payments_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Shipments
CREATE TABLE 
    Shipments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Tên phương thức: GHN, GHTK, Viettel Post...
    description VARCHAR(255), -- Mô tả thêm
    base_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- Phí cơ bản
    icon_url VARCHAR(255) DEFAULT NULL COMMENT 'Icon hoặc class CSS của phương thức vận chuyển', 
    status TINYINT(1) NOT NULL DEFAULT 1, -- 1: hoạt động, 0: ngừng
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Transactions
CREATE TABLE
    Transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    status ENUM('pending', 'confirmed', 'canceled', 'refunded', 'completed') NOT NULL DEFAULT 'pending',
    deli_name VARCHAR(100) NOT NULL,
    deli_phone VARCHAR(20) NOT NULL,
    deli_address VARCHAR(255) NOT NULL,
    deli_email VARCHAR(255) NULL,
    deli_city VARCHAR(100) NOT NULL,
    deli_district VARCHAR(100) NOT NULL,
    deli_ward VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    shipment_status ENUM('pending', 'shipped', 'in_transit', 'delivered', 'returned') NOT NULL DEFAULT 'pending',
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipped_at DATETIME NULL,
    delivered_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NULL,
    payment_id INT UNSIGNED NOT NULL,
    shipment_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id) REFERENCES Payments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_shipment FOREIGN KEY (shipment_id) REFERENCES Shipments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_transactions_status (status),
    INDEX idx_transactions_tracking (tracking_number),
    INDEX idx_transactions_shipment_status (shipment_status),
    INDEX idx_transactions_shipment (shipment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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