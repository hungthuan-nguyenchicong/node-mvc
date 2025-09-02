# mysql2

npm i mysql2

import mysql from 'mysql2/promise';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
## class Database
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

## use
import { Database } from '../core/Database.js';

const pool = this.databaseInstance.getConnection();
### 1
const sql = 'SELECT * FROM `users` WHERE `name` = "Page" AND `age` > 45';

  const [rows, fields] = await connection.query(sql);
### 2
const [rows, fields] = await connection.query({
    sql,
    rowsAsArray: true,
    // ... other options
  });
