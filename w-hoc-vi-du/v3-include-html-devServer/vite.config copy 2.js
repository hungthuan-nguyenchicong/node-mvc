// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
// npm i vite-plugin-include-html -D
import includeHtml from "vite-plugin-include-html";

export default defineConfig({
    root: './frontend',
    plugins: [
        // Sử dụng một plugin duy nhất để xử lý HTML includes
        includeHtml(),
    ],
    server: {
        proxy: {
            '/auth-login/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/auth-check/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/auth-logout/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },

    // Add 'build' to the configuration
    build: {
        rollupOptions: {
            input: {
                // Correct path: remove the leading forward slash
                main: resolve(__dirname, 'frontend/index.html'),
                // This path is already correct
                product: resolve(__dirname, 'frontend/product/index.html'),
            },
            output: {
                entryFileNames: `assets/[name]-[hash].js`,
                chunkFileNames: `assets/[name]-[hash].js`,
                assetFileNames: `assets/[name]-[hash].[ext]`
            }
        }
    }
});