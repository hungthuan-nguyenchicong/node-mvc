// backend/untils/DevServer.js
// npm i node-fetch -D
import fetch from 'node-fetch';
// npm i express-http-proxy -D
import proxy from 'express-http-proxy';
// npm i http-proxy-middleware -D
import { createProxyMiddleware } from 'http-proxy-middleware';
class DevServer {
    constructor(app) {
        this.vite = 'http://localhost:5173/'
        this.devRoute(app);
        this.proxyVite(app);
    }

    devRoute(app) {
        app.get('/dev/{*splat}',createProxyMiddleware({target: this.vite, ws:true}), async (req, res) => {
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
                
                // console.log(html);
                // res.send('test')
            } catch (err) {
                console.error(err)
            }
        }) ;
    }
    proxyVite(app) {
        app.get('/@vite/client', createProxyMiddleware({target: this.vite}));
        //console.log(proxy(this.vite))
        // app.get('/@fs/{*splat}', proxy(this.vite,{ws:true}));
        app.get('/@fs/{*splat}', createProxyMiddleware({target: this.vite}));


    }
}

export { DevServer }