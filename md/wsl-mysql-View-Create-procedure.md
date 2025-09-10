## CREATE PROCEDURE

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

## Xem all PROCEDURE

SHOW PROCEDURE STATUS WHERE Db = 'ten_database';

# Xem định nghĩa

SHOW CREATE PROCEDURE ten_procedure;

# Cách sửa đổi hiệu quả

DROP PROCEDURE IF EXISTS ten_procedure; DELIMITER //
CREATE PROCEDURE ten_procedure(...) BEGIN ... END //
DELIMITER ;

# Xóa
DROP PROCEDURE ten_procedure;

## use

await pool.execute(
            'CALL create_post(?, ?)',
            [postTitle, postDescription]
        );

