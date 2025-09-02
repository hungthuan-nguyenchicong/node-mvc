// vite.config.js
import { defineConfig } from "vite";
//import { createHtmlPlugin } from 'vite-plugin-html';
import includeHtml from "vite-plugin-include-html";
// import htmlTemplate from 'vite-plugin-html-template';
//import includeHtml from "vite-include-html-plugin";
//import htmlTemplate from 'vite-plugin-html-template'

export default defineConfig({
    root: './frontend/pages',
    server: {
        proxy: {
            '/auth-login': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            // '/admin/': {
            //     target: 'http://localhost:3000',
            //     changeOrigin: true,
            // },
            '^/admin/.*': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },
    plugins: [
        // Sử dụng một plugin duy nhất để xử lý HTML includes
        includeHtml(),
    ]
});