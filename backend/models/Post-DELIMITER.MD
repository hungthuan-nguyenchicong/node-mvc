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

## DELIMITER update_post()

DELIMITER //
CREATE PROCEDURE update_post(
    IN postId INT,
    IN postTitle VARCHAR(255),
    IN postDescription TEXT
)
BEGIN
    UPDATE posts SET post_title = postTitle, post_description = postDescription WHERE post_id = postId;
END //
DELIMITER;


await poll.execute('CALL update_post(?, ?, ?)', [postId, postTitle, postDescription])

DELIMITER //
DESC posts;
//

## DELIMITER delete_post();

DELIMITER //
CREATE PROCEDURE delete_post(
    IN postId INT
)
BEGIN
    DELETE FROM posts WHERE post_id = postId;
END //


await pool.execute('CALL delete_post(?)', [postId]);

## trả về hàng mới nhất
DELIMITER //

CREATE PROCEDURE create_post(
    IN postTitle VARCHAR(255),
    IN postDescription TEXT
)
BEGIN
    -- Insert a new row into the posts table
    INSERT INTO posts (title, description) VALUES (postTitle, postDescription);
    
    -- Return the ID of the newly inserted row
    SELECT LAST_INSERT_ID() AS new_post_id;
END //

DELIMITER ;


async function create(postTitle, postDescription) {
    try {
        // Call the stored procedure and get the result
        const [result] = await this.pool.execute('CALL create_post(?, ?)', [postTitle, postDescription]);
        
        // The result of a stored procedure with a SELECT is a nested array.
        // The first element of the outer array contains the result of the SELECT.
        // We can access the new ID from the returned object.
        const newPostId = result[0].new_post_id;
        
        console.log('New post created with ID:', newPostId);
        
        // Return the new ID
        return newPostId;
    } catch (err) {
        console.error('Error creating post:', err);
        throw err;
    }
}