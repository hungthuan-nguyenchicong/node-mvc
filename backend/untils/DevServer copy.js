// backend/untils/DevServer.js
// npm i node-fetch -D
import fetch from 'node-fetch';
// npm i express-http-proxy -D
import proxy from 'express-http-proxy';
class DevServer {
    constructor(app) {
        this.vite = 'http://localhost:5173/'
        this.devRoute(app);
        //this.proxyVite(app);
    }

    devRoute(app) {
        app.get('/dev/{*splat}', async (req, res) => {
            // console.log(req._parsedOriginalUrl.pathname)
            // console.log(req._parsedOriginalUrl.path)
            // res.send('abc')
            const pathname = req._parsedOriginalUrl.pathname;
            // Sử dụng phương thức replace() để loại bỏ '/dev/'
            const newPath = pathname.replace('/dev/', '');
            try {
                const response = await fetch(`${this.vite + newPath}`);
                const html = await response.text();
                // Gửi nội dung HTML này về cho trình duyệt
                res.send(html);
                this.proxyVite(app);
                // console.log(html);
                // res.send('test')
            } catch (err) {
                console.error(err)
            }
        }) ;
    }
    proxyVite(app) {
        app.use('/@vite/client', proxy(this.vite));
        //console.log(proxy(this.vite))
    }
}

export { DevServer }