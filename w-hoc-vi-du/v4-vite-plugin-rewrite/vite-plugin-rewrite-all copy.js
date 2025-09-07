// vite-plugin-rewrite-all
// https://vite.dev/guide/api-plugin.html#configureserver
function redirectAll() {
    return {
        name: "rewrite-all",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                // If the URL starts with '/admin/' and is not '/admin/index.html',
                // redirect it to '/admin/index.html'.
                if (req.url.startsWith('/admin/') && req.url !== '/admin/') {
                    res.writeHead(302, { 'Location': '/admin/' });
                    res.end();
                    return; // Return to prevent further middleware execution
                }

                // If no redirection is needed, continue to the next middleware.
                next();
            });
        },
    };
}

export { redirectAll };