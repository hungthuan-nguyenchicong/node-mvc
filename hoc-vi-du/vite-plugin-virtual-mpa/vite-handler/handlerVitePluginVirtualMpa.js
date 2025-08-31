// vite-handler/handlerVitePluginVirtualMpa.js
// https://www.npmjs.com/package/vite-plugin-virtual-mpa
// npm i vite-plugin-virtual-mpa

import { virtualMpa } from 'vite-plugin-virtual-mpa';

function handlerVitePluginVirtualMpa() {
    // Sửa lại: Trả về trực tiếp plugin virtualMpa
    return virtualMpa({
        pages: [
            {
                name: 'client-index',
                filename: 'index.html',
                template: 'frontend/pages/client/index/index.html',
                //entry: '/src/main.js',
            },
            {
                name: 'admin-login',
                filename: '/admin/login/index.html',
                template: './frontend/pages/admin/login/login.html',
                //entry: '/src/path/main.js',
            },
        ],
    });
}

export { handlerVitePluginVirtualMpa };