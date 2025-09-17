import { createProxyMiddleware } from 'http-proxy-middleware';

class ApiUploadNode {
    constructor() {
        // You can set up any class properties here if needed
    }

    // This method returns the proxy middleware, making it a function
    // that can be used as a request handler by Express.
    getMiddleware() {
        return createProxyMiddleware({
            target: 'http://localhost/api-upload-php/',
            changeOrigin: true,
            headers: {
                'X-From-Node': 'true',
            },
            onError: (err, req, res) => {
                console.error("Proxy error:", err);
                res.status(500).json({ error: 'Proxy forwarding failed.' });
            }
        });
    }
}

export { ApiUploadNode };