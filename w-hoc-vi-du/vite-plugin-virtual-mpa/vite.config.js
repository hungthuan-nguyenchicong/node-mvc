// vite.config.js

import { defineConfig } from "vite";
//import { handlerVitePluginVirtualMpa } from "./vite-handler/handlerVitePluginVirtualMpa";
//import { virtualMpa } from 'vite-plugin-virtual-mpa';
import { createMpaPlugin } from "vite-plugin-virtual-mpa"
export default defineConfig({
    root: './frontend',
    publicDir: 'public',
    plugins: [
        createMpaPlugin({
            pages: [
                {
                    name: 'admin-index',
                    filename: 'admin/index.html',
                    template: 'frontend/pages/admin/index.html',
                    entry: '/src/pages/home/main.js',
                },
                {
                    name: 'about',
                    filename: 'about/index.html',
                    template: 'frontend/src/pages/about/index.html',
                    //entry: '/src/pages/about/main.js',
                },
                {
                    name: 'test',
                    filename: 'test/index.html',
                    template: 'frontend/src/pages/test/index.html',
                    //entry: '/src/pages/about/main.js',
                },
                {
                    name: 'run',
                    filename: 'run/index.html',
                    template: 'frontend/pages/run/index.html',
                    //entry: '/src/pages/about/main.js',
                },
                {
                    name: 'client',
                    filename: 'client/index.html',
                    template: 'frontend/pages/client/index.html',
                    //entry: '/src/pages/about/main.js',
                },
                {
                    name: 'admin-test',
                    filename: 'admin/test/index.html',
                    template: 'frontend/pages/admin/test/index.html',
                    //entry: '/src/pages/about/main.js',
                },
            ],
        }),
    ],
    server: {
        hmr: true,
        // proxy: {
        //     '/api/admin/': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //     }
        // }
    }
});