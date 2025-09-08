import { defineConfig } from 'vite';
import { resolve } from 'path';
// npm i vite-plugin-include-html -D
import { includeHtml } from './vite-include-html-plugin';
import { redirectAll } from './vite-plugin-rewrite-all';
export default defineConfig({
    root: './frontend',
    plugins: [
        // Sử dụng một plugin duy nhất để xử lý HTML includes
        includeHtml(),
        redirectAll(),
    //     {
    //   name: 'log-plugin',
    //   configureServer(server) {
    //     console.log('Vite server started! 🚀');
    //     server.middlewares.use((req, res, next) => {
    //       console.log(`Request received: ${req.method} ${req.url}`);
    //       next();
    //     });
    //   },
    // },
    ],
    assetsInclude: [
        '**/*.html'
    ],
    server: {
        //info: 'abc',
        // configureServer(server) {
        //     console.log(1)
        //     // Middleware này sẽ ghi log TẤT CẢ các yêu cầu đến máy chủ Vite
        //     server.middlewares.use((req, res, next) => {
        //         console.log(`[Vite] Yêu cầu: ${req.url}`);
        //         next();
        //     });
        // },
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
            },
            '/api-admin/': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                admin: resolve(__dirname, 'frontend/admin/index.html'),
                main: resolve(__dirname, 'frontend/index.html'),
                product: resolve(__dirname, 'frontend/product/index.html'),
            },
            output: {
                entryFileNames: `assets/[name]-[hash].js`,
                chunkFileNames: `assets/[name]-[hash].js`,
                assetFileNames: `assets/[name]-[hash].[ext]`
            }
        }
    },
    
});
