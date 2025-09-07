// frontend/src/admin/pages/notFound.js

function notFound() {
    function index(params = {}) {
        const {err} = params
        return /* html */ `
        <h1>Page not Found</h1>
        <p>${err}</p>
        `;
    }

    return {index}
}

export {notFound}