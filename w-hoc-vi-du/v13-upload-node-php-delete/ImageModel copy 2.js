// backend/models/ImageModel.js
/**
CREATE TABLE images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    image_src VARCHAR(255) NOT NULL UNIQUE
);

sudo mysql
SHOW DATABASES;
USE database;
SHOW TABLES;

DESC images;


/* INSERT IMAGE

DELIMITER //
CREATE PROCEDURE insert_image(
    IN imageSrc VARCHAR(255)
)
BEGIN
    INSERT INTO images (image_src) VALUES (imageSrc);
END//

SHOW CREATE PROCEDURE insert_image;

/* use

CALL insert_image(?), [imageSrc]

/* inserImage
ver2

DROP PROCEDURE IF EXISTS insert_image;

DELIMITER //
CREATE PROCEDURE insert_image(
    IN imageSrc VARCHAR(255)
)
BEGIN
    INSERT INTO images (image_src) VALUES (imageSrc);
    SELECT LAST_INSERT_ID();
END//



/* delete_image(mimageId)

DELIMITER //
CREATE PROCEDURE delete_image(
    IN imageId INT
)
BEGIN
    DELETE FROM images WHERE image_id = imageId;
END //

SHOW CREATE PROCEDURE delete_image;
await pool.execute('CALL delete_image(?)', [imageId]);



 */

import { Database } from "../core/Database.js";
class ImageModel {
    constructor() {
        this.databaseInstance = new Database();
        this.pool = this.databaseInstance.getConnection();
    }

    async insert_image(imageSrc) {
        try {
            const [results] = await this.pool.execute('CALL insert_image(?)', [imageSrc]);
            //console.log(results);

            // Lấy giá trị ID từ tập hợp kết quả thứ hai
            const imageInsertId = results[0][0]['LAST_INSERT_ID()'];

            //console.log("Inserted Image ID:", imageInsertId);
            return imageInsertId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async delete_image(imageId) {
        try {
            await this.pool.execute('CALL delete_image(?)', [imageId]);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export { ImageModel }