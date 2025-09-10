# CREATE TABLE

CREATE TABLE posts(
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    post_title VARCHAR(255) NOT NULL,
    post_description TEXT NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESYAMP ON UPDATE CURRENT_TIMESTAMP
);

## DELIMITER create_post()
DELIMITER //
CREATE PROCEDURE create_post(
    IN postTitle VARCHAR(255);
    IN postDescription TEXT
)
BEGIN
    INSERT INTO posts (post_title, post_description)
    VALUES (postTitle, postDescription);
END //
DELIMITER;
### USE
await pool.execute('CALL create_post(?, ?)',
[postTitle, postDescription]);
## DELIMITER show_posts()
DELIMITER //
CREATE PROCEDURE show_posts()
BEGIN
    SELECT post_title, post_description FROM posts;
END //
DELIMITER;
### xóa show_posts() thêm post_id
DROP PROCEDURE IF EXISTS show_posts;
## Viết lại show_posts()
DELIMITER //
CREATE PROCEDURE show_posts()
BEGIN
    SELECT post_id, post_title, post_description FROM posts;
END //
DELIMITER;

## xem
SHOW PROCEDURE STATUS WHERE Db = 'nodeMvc';
SHOW CREATE PROCEDURE show_posts;

## DELIMITER show_post

DELIMITER //
CREATE PROCEDURE show_post(
    IN postId INT
)
    SELECT post_title, post_description FROM posts WHERE post_id = postId;
BEGIN
END //
DELIMITER;


await poll.execute('CALL show_post(?), [id])