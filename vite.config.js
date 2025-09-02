// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    root: './frontend/pages',

    server: {
        proxy: {
            '/auth/login': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});