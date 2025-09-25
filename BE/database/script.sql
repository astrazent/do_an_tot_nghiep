-- Drop (reverse order) để tránh lỗi FK khi chạy lại
DROP TABLE IF EXISTS CouponRedemptions;

DROP TABLE IF EXISTS PromotionProducts;

DROP TABLE IF EXISTS Promotions;

DROP TABLE IF EXISTS OrderItems;

DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Coupons;

DROP TABLE IF EXISTS Posts;

DROP TABLE IF EXISTS PostCategories;

DROP TABLE IF EXISTS Contacts;

DROP TABLE IF EXISTS Comments;

DROP TABLE IF EXISTS Reviews;

DROP TABLE IF EXISTS Shipments;

DROP TABLE IF EXISTS Payments;

DROP TABLE IF EXISTS CartItems;

DROP TABLE IF EXISTS Carts;

DROP TABLE IF EXISTS Inventory;

DROP TABLE IF EXISTS ProductImages;

DROP TABLE IF EXISTS Products;

DROP TABLE IF EXISTS Categories;

DROP TABLE IF EXISTS UserRoles;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS Roles;

-- Roles (giữ nguyên)
CREATE TABLE
    Roles (
        role_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Users
CREATE TABLE
    Users (
        user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        full_name VARCHAR(100),
        address TEXT,
        avatar VARCHAR(255),
        role_id INT UNSIGNED NOT NULL, -- phải UNSIGNED
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1=active,0=inactive',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES Roles (role_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_users_email (email),
        INDEX idx_users_username (username),
        INDEX idx_users_role (role_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Categories (self-relation)
CREATE TABLE
    Categories (
        category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL,
        description TEXT,
        parent_id INT UNSIGNED NULL,
        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES Categories (category_id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_categories_parent (parent_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Products
CREATE TABLE
    Products (
        product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id INT UNSIGNED NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        discount_price DECIMAL(12, 2) NULL,
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1=active,0=inactive',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES Categories (category_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_products_category (category_id),
        INDEX idx_products_name (name)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ProductImages
CREATE TABLE
    ProductImages (
        image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_main BOOLEAN NOT NULL DEFAULT 0,
        CONSTRAINT fk_productimages_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_productimages_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Inventory (1-to-1 with Products: product_id is PK + FK)
CREATE TABLE
    Inventory (
        product_id INT UNSIGNED PRIMARY KEY,
        stock_quantity INT NOT NULL DEFAULT 0,
        low_stock_threshold INT NOT NULL DEFAULT 5,
        last_restock_at DATETIME NULL,
        CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Carts
CREATE TABLE
    Carts (
        cart_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_carts_user (user_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- CartItems
CREATE TABLE
    CartItems (
        cart_item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        cart_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cartitems_cart FOREIGN KEY (cart_id) REFERENCES Carts (cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_cartitems_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        INDEX idx_cartitems_cart (cart_id),
        INDEX idx_cartitems_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Payments
CREATE TABLE
    Payments (
        payment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        method VARCHAR(50) NOT NULL, -- COD, CreditCard, Momo, VNPay, ...
        status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
        paid_amount DECIMAL(12, 2) NULL,
        paid_at DATETIME NULL,
        transaction_reference VARCHAR(200),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payments_method (method),
        INDEX idx_payments_status (status)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Shipments
CREATE TABLE
    Shipments (
        shipment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        address TEXT NOT NULL,
        shipping_method VARCHAR(50),
        tracking_number VARCHAR(100),
        status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, shipped, in_transit, delivered, returned
        shipped_at DATETIME NULL,
        delivered_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_shipments_status (status),
        INDEX idx_shipments_tracking (tracking_number)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE
    Reviews (
        review_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CHECK (rating BETWEEN 1 AND 5),
        INDEX idx_reviews_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Comments
CREATE TABLE
    Comments (
        comment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_comments_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Contacts
CREATE TABLE
    Contacts (
        contact_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NULL,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_contacts_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_contacts_user (user_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- PostCategories
CREATE TABLE
    PostCategories (
        post_category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Posts
CREATE TABLE
    Posts (
        post_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id INT UNSIGNED NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        author_id INT UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES PostCategories (post_category_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_posts_author (author_id),
        INDEX idx_posts_category (category_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Coupons
CREATE TABLE
    Coupons (
        coupon_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        type TINYINT NOT NULL COMMENT '0=ship, 1=product discount',
        measure TINYINT NOT NULL COMMENT '0=money, 1=percent',
        value DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- if 0 = free
        max_value DECIMAL(12, 2) NULL,
        start_date DATETIME NULL,
        end_date DATETIME NULL,
        status TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_coupons_code (code),
        INDEX idx_coupons_status (status)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Orders
CREATE TABLE
    Orders (
        order_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        payment_id INT UNSIGNED NULL,
        shipment_id INT UNSIGNED NULL,
        coupon_id INT UNSIGNED NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_orders_payment FOREIGN KEY (payment_id) REFERENCES Payments (payment_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_orders_shipment FOREIGN KEY (shipment_id) REFERENCES Shipments (shipment_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES Coupons (coupon_id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_orders_user (user_id),
        INDEX idx_orders_status (status)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -- OrderItems
-- CREATE TABLE
--     OrderItems (
--         order_item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--         order_id INT UNSIGNED NOT NULL,
--         product_id INT UNSIGNED NOT NULL,
--         quantity INT NOT NULL DEFAULT 1,
--         price DECIMAL(12, 2) NOT NULL,
--         CONSTRAINT fk_orderitems_order FOREIGN KEY (order_id) REFERENCES Orders (order_id) ON DELETE CASCADE ON UPDATE CASCADE,
--         CONSTRAINT fk_orderitems_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--         INDEX idx_orderitems_order (order_id),
--         INDEX idx_orderitems_product (product_id)
--     ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Optional: track coupon redemptions (who used which coupon & when)
CREATE TABLE
    CouponRedemptions (
        redemption_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        coupon_id INT UNSIGNED NOT NULL,
        order_id INT UNSIGNED NULL,
        user_id INT UNSIGNED NULL,
        redeemed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        amount_applied DECIMAL(12, 2) NULL,
        CONSTRAINT fk_couponred_coupon FOREIGN KEY (coupon_id) REFERENCES Coupons (coupon_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_couponred_order FOREIGN KEY (order_id) REFERENCES Orders (order_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_couponred_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE SET NULL ON UPDATE CASCADE,
        INDEX idx_couponred_coupon (coupon_id),
        INDEX idx_couponred_user (user_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Promotions
CREATE TABLE
    Promotions (
        promotion_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATETIME NULL,
        end_date DATETIME NULL,
        discount_percent DECIMAL(5, 2) NULL,
        status TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- PromotionProducts (many-to-many Promotion <-> Product)
CREATE TABLE
    PromotionProducts (
        promotion_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (promotion_id, product_id),
        CONSTRAINT fk_promotionproducts_promo FOREIGN KEY (promotion_id) REFERENCES Promotions (promotion_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_promotionproducts_product FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_promotionproducts_product (product_id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- (Optional) Helpful views or triggers can be added later for stock alert, order totals, etc.