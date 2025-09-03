## How to Proxy a WebSocket with express-http-proxy
The `express-http-proxy` library doesn't have a direct `ws: true` option for WebSockets like Vite's built-in proxy. To proxy WebSocket connections using `express-http-proxy`, you need to configure it with an `upgrade` handler.

This involves listening for the `upgrade` event on the HTTP server and then manually proxying the WebSocket connection.

-----

### How to Proxy a WebSocket with `express-http-proxy`

You need to set up a separate `express-http-proxy` instance for the WebSocket connection and handle the server `upgrade` event. Here's how you can combine it with your Express app:

```javascript
const express = require('express');
const { createServer } = require('http');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 3000;
const VITE_PORT = 5173;

// Create an HTTP server and attach the Express app
const server = createServer(app);

// Use express-http-proxy for standard HTTP requests
app.use('/dev', proxy(`http://localhost:${VITE_PORT}`, {
    proxyReqPathResolver: (req) => {
        const path = req.url.replace(/^\/dev/, '');
        return path || '/';
    }
}));

// --- WebSocket Proxying ---

// Create a separate proxy instance for WebSocket connections
const wsProxy = proxy(`http://localhost:${VITE_PORT}`, {
    proxyReqPathResolver: (req) => {
        const path = req.url.replace(/^\/dev/, '');
        return path || '/';
    }
});

// Listen for the 'upgrade' event on the server
server.on('upgrade', (req, socket, head) => {
    // Check if the upgrade request is for the path you want to proxy
    if (req.url.startsWith('/dev/')) {
        // Forward the WebSocket upgrade request to the Vite server
        wsProxy(req, socket, head, null, null, null);
    } else {
        socket.destroy(); // Reject other upgrade requests
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
```

This setup separates the HTTP and WebSocket proxying logic. The `app.use` handles standard `GET/POST` requests, and the `server.on('upgrade')` handler is responsible for intercepting and proxying the WebSocket handshake. This ensures both types of traffic are correctly routed to your Vite dev server.

# ver 2

Tôi hiểu rồi. Bạn muốn viết lại class `DevServer` để proxy tất cả các yêu cầu từ Express sang Vite, bao gồm cả các kết nối WebSocket.

Lưu ý rằng module **`http`** là một thư viện tích hợp sẵn của Node.js, bạn không cần phải cài đặt nó. Nó cung cấp các công cụ cần thiết để tạo và quản lý máy chủ HTTP, cho phép chúng ta xử lý các sự kiện như `upgrade` (cần thiết cho WebSocket).

Dưới đây là phiên bản hoàn chỉnh của class `DevServer`, sử dụng `express-http-proxy` để xử lý cả HTTP và WebSocket một cách hiệu quả.

```javascript
// backend/untils/DevServer.js
// npm i express-http-proxy -D
import proxy from 'express-http-proxy';
// `http` là module tích hợp sẵn của Node.js, không cần cài đặt.
import { createServer } from 'http';

class DevServer {
    /**
     * @param {import('express').Express} app - Express app instance.
     * @param {import('http').Server} server - Node.js HTTP server instance.
     */
    constructor(app, server) {
        this.vite = 'http://localhost:5173/';
        this.setupProxy(app, server);
    }

    /**
     * Cấu hình proxy cho cả HTTP và WebSocket.
     * @param {import('express').Express} app
     * @param {import('http').Server} server
     */
    setupProxy(app, server) {
        // --- 1. Proxy cho các yêu cầu HTTP thông thường (GET, POST, etc.) ---
        // Sử dụng `app.use` để xử lý tất cả các phương thức HTTP.
        app.use('/dev', proxy(this.vite, {
            // `proxyReqPathResolver` sẽ sửa lại đường dẫn trước khi gửi đến Vite.
            // Ví dụ: '/dev/assets/index.js' sẽ trở thành '/assets/index.js'
            proxyReqPathResolver: (req) => {
                const path = req.url.replace(/^\/dev/, '');
                return path || '/';
            }
        }));

        // --- 2. Proxy cho các kết nối WebSocket ---
        // Lắng nghe sự kiện `upgrade` trên máy chủ HTTP.
        // Sự kiện này được kích hoạt khi trình duyệt yêu cầu nâng cấp kết nối từ HTTP sang WebSocket.
        server.on('upgrade', (req, socket, head) => {
            // Kiểm tra xem yêu cầu có phải dành cho đường dẫn `/dev` không.
            if (req.url.startsWith('/dev')) {
                // Sử dụng `express-http-proxy` để chuyển tiếp (proxy) kết nối WebSocket.
                // Lưu ý: Chúng ta phải gọi hàm proxy trực tiếp, không phải qua `app.use`.
                proxy(this.vite)(req, socket, head);
            } else {
                // Từ chối các yêu cầu nâng cấp không mong muốn.
                socket.destroy();
            }
        });
    }
}

export { DevServer };
```

## v2

// backend/server.js
import express from 'express';
import { createServer } from 'http'; // Đảm bảo import http
import { DevServer } from './untils/DevServer.js';

const app = express();
const PORT = 3000;

// Tạo máy chủ HTTP riêng và gắn Express app vào
const server = createServer(app);

// Bây giờ, truyền cả `app` và `server` vào constructor
new DevServer(app, server); 

// Lắng nghe trên máy chủ HTTP đã gắn cả Express và WebSocket
server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});