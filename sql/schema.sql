-- =============================================
-- SIKOPET Cloud Database Schema
-- For Synchronization with Local Dexie DB
-- =============================================

CREATE DATABASE IF NOT EXISTS sikopet_cloud;
USE sikopet_cloud;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'ba', 'pmo') NOT NULL DEFAULT 'operator',
    cooperative_id BIGINT UNSIGNED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_email (email),
    INDEX idx_cooperative (cooperative_id),
    INDEX idx_role (role),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- COOPERATIVES TABLE
-- =============================================
CREATE TABLE cooperatives (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_name (name(100)),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MEMBERS TABLE
-- =============================================
CREATE TABLE members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cooperative_id BIGINT UNSIGNED NOT NULL,
    member_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (cooperative_id) REFERENCES cooperatives(id) ON DELETE CASCADE,
    INDEX idx_member_number (member_number),
    INDEX idx_cooperative (cooperative_id),
    INDEX idx_name (name(100)),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAVINGS TABLE
-- =============================================
CREATE TABLE savings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(18, 2) NOT NULL DEFAULT 0,
    type ENUM('deposit', 'withdrawal') NOT NULL,
    description VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member (member_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- LOANS TABLE
-- =============================================
CREATE TABLE loans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT UNSIGNED NOT NULL,
    principal DECIMAL(18, 2) NOT NULL DEFAULT 0,
    interest DECIMAL(5, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(18, 2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(18, 2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status ENUM('pending', 'active', 'completed', 'overdue', 'rejected') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member (member_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(18, 2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_name (name(100)),
    INDEX idx_category (category),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INVENTORY TABLE
-- =============================================
CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 0,
    location VARCHAR(100),
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_product (product_id),
    INDEX idx_stock (stock),
    INDEX idx_location (location(50)),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('sale', 'purchase', 'expense', 'income', 'transfer') NOT NULL,
    reference_id VARCHAR(100),
    amount DECIMAL(18, 2) NOT NULL DEFAULT 0,
    description VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_type (type),
    INDEX idx_reference (reference_id),
    INDEX idx_created_at (created_at),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('info', 'warning', 'error', 'success') NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    action ENUM('create', 'update', 'delete') NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED,
    payload JSON,
    user_id BIGINT UNSIGNED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_entity (entity),
    INDEX idx_entity_id (entity_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SYNC QUEUE TABLE
-- =============================================
CREATE TABLE sync_queue (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    operation ENUM('create', 'update', 'delete') NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED,
    payload JSON,
    status ENUM('pending', 'syncing', 'failed', 'completed') NOT NULL DEFAULT 'pending',
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    user_id BIGINT UNSIGNED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME NULL,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_entity (entity),
    INDEX idx_entity_id (entity_id),
    INDEX idx_created_at (created_at),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SETTINGS TABLE
-- =============================================
CREATE TABLE settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_key (`key`),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MODULES TABLE
-- =============================================
CREATE TABLE modules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    route VARCHAR(255),
    category ENUM('utama', 'operasional', 'tim', 'lainnya') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    `order` INT NOT NULL DEFAULT 0,
    dependencies JSON,
    coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    sync_status ENUM('synced', 'pending', 'conflict') DEFAULT 'pending',
    local_id BIGINT UNSIGNED NULL,
    INDEX idx_key (`key`),
    INDEX idx_category (category),
    INDEX idx_enabled (enabled),
    INDEX idx_order (`order`),
    INDEX idx_sync_status (sync_status),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SYNC LOGS TABLE (Audit Trail)
-- =============================================
CREATE TABLE sync_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    direction ENUM('push', 'pull') NOT NULL,
    entity VARCHAR(100) NOT NULL,
    records_affected INT NOT NULL DEFAULT 0,
    status ENUM('success', 'partial', 'failed') NOT NULL,
    error_message TEXT,
    started_at DATETIME NOT NULL,
    completed_at DATETIME NULL,
    user_id BIGINT UNSIGNED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_direction (direction),
    INDEX idx_entity (entity),
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- REFRESH TOKENS TABLE (Auth)
-- =============================================
CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
