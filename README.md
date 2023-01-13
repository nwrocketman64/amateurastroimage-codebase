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
  PRIMARY KEY (request_id)
);