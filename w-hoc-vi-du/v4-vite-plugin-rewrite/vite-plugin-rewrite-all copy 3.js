// vite-plugin-rewrite-all
// https://vite.dev/guide/api-plugin.html#configureserver
function redirectAll() {
    return {
        name: "rewrite-all",
        configureServer(server) {
    server.middlewares.use((req, res, next) => {
        // Kiểm tra xem yêu cầu có phải là một file (có chứa dấu chấm)
        // và nằm trong thư mục '/admin/' hay không.
        const isFile = req.url.includes('.');

        // Nếu URL bắt đầu bằng '/admin/' và không phải là một file,
        // chúng ta sẽ ghi đè URL để Vite Dev Server trả về file index.html.
        if (req.url.startsWith('/admin/') && !isFile) {
            req.url = '/admin/index.html';
        }
        
        // Tiếp tục xử lý request với URL đã được ghi đè (nếu có).
        next();
    });
},
    };
}

export { redirectAll };