CREATE DATABASE IF NOT EXISTS ai_avatar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_avatar;
GRANT ALL PRIVILEGES ON ai_avatar.* TO 'avataruser'@'%';
FLUSH PRIVILEGES;
