// backend/core/Database.js
import mysql from 'mysql2/promise';
class Database {
    static instance = null;

    constructor() {
        if (Database.instance) {
            return Database.instance
        }
        // config
        const host = process.env.DB_HOST || 'localhost';
        const user = process.env.DB_USER || 'root';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME || 'mysql';

        // Tạo một connection pool thay vì một kết nối duy nhất
        this.pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });
        // Gán instance hiện tại vào thuộc tính tĩnh
        Database.instance = this;
    }
    // Phương thức để lấy pool kết nối
    getConnection() {
        return this.pool;
    }
}

export {Database}