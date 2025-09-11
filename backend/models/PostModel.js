// backend/models/PostModel.js
/**
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    post_title VARCHAR(255) NOT NULL,
    post_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER //
CREATE PROCEDURE create_post(
    IN postTitle VARCHAR(255),
    IN postDescription TEXT
)
BEGIN
    INSERT INTO posts (post_title, post_description)
    VALUES (postTitle, postDescription);
END //
DELIMITER ;

// USE

await pool.execute(
            'CALL create_post(?, ?)',
            [postTitle, postDescription]
        );


// INDEX -> show all posts


DELIMITER //
CREATE PROCEDURE show_posts()
BEGIN
    SELECT post_title, post_description FROM posts;
END //
DELIMITER ;

// Show by id


DELIMITER //
CREATE PROCEDURE show_post(
    IN postId INT
)
    SELECT post_title, post_description FROM posts WHERE post_id = postId;
BEGIN
END //
DELIMITER;

await poll.execute('CALL show_post(?), [id])


// update_post

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

 */

import { Database } from "../core/Database.js"
class PostModel {

    constructor() {
        this.databaseInstance = new Database();
        this.pool = this.databaseInstance.getConnection();
    }

    async create(postTitle, postDescription) {
        try {
            await this.pool.execute('CALL create_post(?, ?)', [postTitle, postDescription]);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async show_posts() {
        try {
            const [result] = await this.pool.execute('CALL show_posts()');
            return result[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async show_post(postId) {
        try {
            const [result] = await this.pool.execute('CALL show_post(?)', [postId]);
            return result[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async update_post(postId, postTitle, postDescription) {
        try {
            const result = await this.pool.execute('CALL update_post(?, ?, ?)', [postId, postTitle, postDescription]);
            return result;
        } catch (err) {
            console.error(err);
            throw err
        }
    }
}

export { PostModel }