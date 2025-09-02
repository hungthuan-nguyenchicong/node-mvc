// vite.config.js
import { defineConfig } from "vite";
//import { createHtmlPlugin } from 'vite-plugin-html';
import includeHtml from "vite-plugin-include-html";
// import htmlTemplate from 'vite-plugin-html-template';
//import includeHtml from "vite-include-html-plugin";
import htmlTemplate from 'vite-plugin-html-template'

export default defineConfig({
    root: './src',
    server: {
        proxy: {
            '/auth/login': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },
    plugins: [
        // Sử dụng một plugin duy nhất để xử lý HTML includes
        includeHtml({
            // Các đường dẫn include sẽ được giải quyết từ thư mục gốc frontend
            root: './frontend'
        }),
        // Sử dụng createHtmlPlugin để xử lý các điểm vào
        htmlTemplate({
            pagesDir: './src/pages',
            pages: {
                subpage: {
                    template: 'src/pages/login/index.html',
                }
            }
            // Cấu hình cho trang login
        }),
        // createHtmlPlugin({
        //     // Cấu hình cho trang admin
        //     entry: '/admin/admin.js', // Sửa đường dẫn entry cho trang admin
        //     template: '/admin/index.html',
        //     // Chỉ định tên file đầu ra mà không có đường dẫn thư mục
        //     filename: 'admin.html'
        // }),
    ]
});