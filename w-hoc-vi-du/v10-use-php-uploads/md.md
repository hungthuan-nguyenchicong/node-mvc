# vite

'/uploads': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }

## proxy

// Cấu hình proxy cho các tệp tĩnh, ví dụ: hình ảnh
const imageProxy = createProxyMiddleware({
    target: 'http://localhost/uploads',
    changeOrigin: true,
    // pathRewrite: {
    //     '^/uploads': '/',
    // },
});

app.use('/uploads', imageProxy);