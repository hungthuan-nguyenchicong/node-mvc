// frontend/src/admin/pages/dashboard.js

function dashboard() {
    function index () {
        function render() {
            return /* html */ `
            <h1>Dashboard</h1>
            `;
        }

        return {render}
    };

    return {index};
}

export {dashboard};