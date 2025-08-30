// vite.config.js

import { defineConfig } from "vite";

export default defineConfig({
    root: './frontend',
    publicDir: 'public',
    server: {
        proxy: {
            '/api/admin/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});