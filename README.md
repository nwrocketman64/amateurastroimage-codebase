# amateurastroimage-codebase
This is the new codebase for Amateur Astro Image website.

Session Database table
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
)

Request Table
CREATE TABLE astro_image.requests (
  request_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  date DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (request_id)
);

Users Table
CREATE TABLE astro_image.users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);

Images Table
CREATE TABLE astro_image.images (
  image_id INT NOT NULL AUTO_INCREMENT,
  object VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  telescope VARCHAR(255) NOT NULL,
  comments TEXT NOT NULL,
  date DATETIME NOT NULL,
  PRIMARY KEY (image_id)
);

ALTER TABLE your_database_name.your_table CONVERT TO CHARACTER SET utf8;