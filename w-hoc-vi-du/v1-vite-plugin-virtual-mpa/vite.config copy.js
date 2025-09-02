// vite.config.js

import { defineConfig } from "vite";
import { handlerVitePluginVirtualMpa } from "./vite-handler/handlerVitePluginVirtualMpa";

export default defineConfig({
    root: './frontend',
    publicDir: 'public',
    plugins: [
        handlerVitePluginVirtualMpa(),
        // Các plugin khác
    ],
    server: {
        hmr: true,
        proxy: {
            '/api/admin/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});