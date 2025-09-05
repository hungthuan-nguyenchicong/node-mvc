// backend/untils/DevServer.js
// npm i node-fetch -D
import fetch from 'node-fetch';
// npm i express-http-proxy -D
//import proxy from 'express-http-proxy';
// npm i http-proxy-middleware -D;
//import {createServer} from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
class DevServer {
    constructor(app) {
        this.vite = 'http://localhost:5173/'
        this.devRoute(app);
        this.proxyVite(app);
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
                if (response.ok) {
                    const html = await response.text();
                    const newHtml = html.replace('../', '/');
                    // Gửi nội dung HTML này về cho trình duyệt
                    res.send(newHtml);
                }
                // console.log(html);
                // res.send('test')
            } catch (err) {
                console.error(err)
            }
        });
    }
    proxyVite(app) {
        app.get('/@vite/client', createProxyMiddleware({ target: this.vite }));
        //console.log(proxy(this.vite))
        // app.get('/@fs/{*splat}', proxy(this.vite,{ws:true}));
        app.get('/@fs/{*splat}', createProxyMiddleware({ target: this.vite }));
        // /scr/ 
        app.get('/src/{*splat}', createProxyMiddleware({ target: this.vite }));
        // /favicon.png
        app.get('/favicon.png', createProxyMiddleware({ target: this.vite }));
        // proxy ws://
        app.use(createProxyMiddleware({ target: this.vite, ws: true }));
        //app.use(proxy(this.vite, {ws: true}));
    }
}

export { DevServer }