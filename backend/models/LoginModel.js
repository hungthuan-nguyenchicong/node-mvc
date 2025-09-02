// backend/models/LoginModel.js
/**
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL
);
INSERT INTO users (username, password_hash) VALUES ('admin', '$2b$10$62o9VS/hM4XVgCqn9jiUxOBp3jeur9DcOAKEm9hCqqqv7RZV3AsLm');
 */
import bcrypt from 'bcrypt';
import { Database } from '../core/Database.js';
class LoginModel {
    constructor() {
        //this.hashPassword();
        this.databaseInstance = new Database();
        //this.getUser();
        // const username = 'admin';
        // const password = 'cong'
        // this.validate(username, password);
    }

    async getUser() {
        const pool = this.databaseInstance.getConnection();
        try {
            const sql = `SELECT * FROM users`;
            const [rows] = await pool.query(sql);
            //console.log(rows);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async validate(username, password) {
        const pool = this.databaseInstance.getConnection();
        try {
            const sql = `SELECT password_hash FROM users WHERE username = ? LIMIT 1`;
            const values = [username];
            const [rows] = await pool.execute(sql, values);
            // không tồn tại username
            if (rows.length === 0) {
                return false;
            }
            // password_hashed
            const hashedPassword = rows[0].password_hash;
            // compare bcrypt
            // const isMatch = await bcrypt.compare(password, hashedPassword)
            // //console.log(isMatch)
            // return isMatch;
            return await bcrypt.compare(password, hashedPassword).then((result) => {
                // result == false
                //console.log(result);
                return result;
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
        
    }

    // Một phương thức để băm mật khẩu mới (chỉ dùng để tạo mật khẩu đã băm cho constructor)
    async hashPassword() {
        const saltRounds = 10;
        const myPlaintextPassword = process.env.LG_PASSWORD || 's0/\/\P4$$w0rD';
        //console.log(myPlaintextPassword)
        try {
            
            // bcrypt.genSalt(saltRounds, function(err, salt) {
            //     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            //         // Store hash in your password DB.
            //         console.log(hash);
            //     });
            // });
            // with promises
            await bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
                // Store hash in your password DB.
                console.log(hash)
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export {LoginModel}