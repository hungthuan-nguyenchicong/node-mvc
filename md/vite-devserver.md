# vite Dev server

import { createServer as createViteServer } from 'vite'

import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Tạo server Vite ở chế độ middleware
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      // ===================================
      // Thêm cấu hình proxy tại đây
      // ===================================
      proxy: {
        // Tất cả các yêu cầu bắt đầu bằng '/api' sẽ được chuyển đến server backend
        '/api': {
          target: 'http://localhost:5000', // URL của server backend của bạn
          changeOrigin: true, // Thay đổi header Host và Origin để tránh lỗi CORS
          // tùy chọn rewrite:
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    appType: 'custom',
  })

  // Sử dụng Vite làm middleware
  app.use(vite.middlewares)

  // Bạn có thể thêm các middleware và route khác của Express sau dòng này
  // Ví dụ: app.get('/custom-route', (req, res) => res.send('Hello from Express!'))

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

createServer()