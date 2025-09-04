// backend/untils/DevServer.js
import { createServer as createViteServer } from 'vite';
import fs from 'fs';

class DevServer {
    constructor(app) {
        this.app = app;
        this.init();
    }

    async init() {
        await this.createServer();
    }

    async createServer() {
        const vite = await createViteServer({
            server: {
                middlewareMode: true,
            },
            appType: 'custom',
        });
        
        // This is the correct and only necessary line to integrate Vite's middleware.
        // It tells Express to use Vite's middleware for any request starting with /dev.
        this.app.use('/dev', vite.middlewares);

        // Optional: Add a route to handle the main HTML file within the /dev path.
        // This is required because appType is 'custom'.
        this.app.get('/dev/{*splat}', async (req, res, next) => {
            if (req.originalUrl.endsWith('/') || req.originalUrl.includes('.html')) {
                try {
                    let template = fs.readFileSync('/frontend/product/index.html', 'utf-8');
                    template = await vite.transformIndexHtml(req.originalUrl, template);
                    res.send(template);
                } catch (e) {
                    vite.ssrFixStacktrace(e);
                    next(e);
                }
            } else {
                next();
            }
        });
    }
}

export { DevServer };