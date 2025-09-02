// backend/core/ExpressSession.js
import express_session from 'express-session';
class ExpressSession {
    constructor(app) {
        //console.log('session: '+  app.get('env'));
        const secret = process.env.SECRET || 'keyboard cat';
        const sess = {
            secret: secret, // Khóa bí mật để ký session ID
            resave: false, // Không lưu lại session nếu không có thay đổi
            saveUninitialized: true, // Lưu session mới chưa được khởi tạo
            cookie: {
                httpOnly: true, // Ngăn JS client truy cập cookie
                maxAge: 1000 * 60 * 60 *24 // time 24h
            }
        }
        
        // cấu hình dùng https

        if (app.get('env' === 'production')) {
            app.set('trust proxy', 1);
            sess.cookie.secure = true; // true nếu https
        }

        app.use(express_session(sess));
    }
}

export {ExpressSession}