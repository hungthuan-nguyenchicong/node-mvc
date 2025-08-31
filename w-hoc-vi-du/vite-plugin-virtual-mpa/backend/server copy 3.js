// backend/server.js

import express from 'express';
import fetch from 'node-fetch';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = 3000;

// URL của Vite dev server
// Mặc định là 5173. Hãy đảm bảo Vite đang chạy trên cổng này.
const viteDevServerUrl = 'http://localhost:5173';

// Route để xử lý tất cả các yêu cầu và proxy chúng tới Vite dev server.
app.get(/^\/(.*)/, createProxyMiddleware({
//app.get('/', createProxyMiddleware({

    target: viteDevServerUrl,
    changeOrigin: true, // This is important for virtual hosting.
    //ws: true, // This is the key to proxying WebSocket connections.
  }), async (req, res) => {
  try {
    const vitePath = req.originalUrl;
    // Fetch toàn bộ nội dung từ Vite dev server
    const response = await fetch(viteDevServerUrl + vitePath);

    // Chuyển tiếp các headers từ phản hồi của Vite (như Content-Type)
    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    // Chuyển tiếp trạng thái HTTP
    res.status(response.status);

    // Chuyển tiếp toàn bộ nội dung
    const content = await response.text();
    res.send(content);

  } catch (e) {
    console.error('Lỗi khi proxy yêu cầu tới Vite:', e);
    res.status(500).send('Máy chủ frontend không khả dụng hoặc lỗi.');
  }
});

// Middleware để phân tích JSON request body
app.use(express.json());

// Lắng nghe cổng đã định nghĩa
app.listen(port, () => {
  console.log(`Server Express đang chạy tại http://localhost:${port}`);
  console.log(`Đang proxy các yêu cầu tới Vite tại ${viteDevServerUrl}`);
});