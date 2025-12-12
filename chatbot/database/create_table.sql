DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Conversations;
DROP TABLE IF EXISTS DocumentChunks;
DROP TABLE IF EXISTS Documents;
DROP TABLE IF EXISTS DataSources;

-- DataSources
CREATE TABLE 
    DataSources (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Documents
CREATE TABLE 
    Documents (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(150),
    datasource_id INT UNSIGNED NULL,
    description VARCHAR(250) NOT NULL,
    source_type ENUM('pdf','json','txt') NOT NULL,
    doc_owner ENUM('user','system') NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_docs_datasource
        FOREIGN KEY (datasource_id) REFERENCES DataSources(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DocumentChunks
CREATE TABLE 
    DocumentChunks (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    document_id INT UNSIGNED NOT NULL,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chunks_docs FOREIGN KEY (document_id)
        REFERENCES Documents(id) ON DELETE CASCADE
);

-- Conversations
CREATE TABLE
    Conversations (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    status ENUM('active','ended') NOT NULL DEFAULT 'active',
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_message_time DATETIME NULL,
    end_time DATETIME NULL
);

-- Messages
CREATE TABLE 
    Messages (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT UNSIGNED NOT NULL,
    sender VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES Conversations(id)
        ON DELETE CASCADE
);