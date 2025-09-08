## router

async function renderContent(pageName, viewName, params, mainContent) {
    const pageModule = routes[pageName];

    if (typeof pageModule === 'function') {
        const pageFunction = pageModule();

        const viewModule = pageFunction[viewName];
        if (typeof viewModule === 'function') {
            const viewContent = await viewModule(params);
            mainContent.innerHTML = viewContent;
            //console.log(viewContent)
        } else {
            params.err = `Không tìm thấy: v=${viewName} --> trong: p=${pageName}`;
            mainContent.innerHTML = routes.notFound().index(params);
        }
    } else {
        params.err = `Trang không tồn tại: p=${pageName}`
        mainContent.innerHTML = routes.notFound().index(params)
    }
}

## dashboard
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

## not found

// frontend/src/admin/pages/notFound.js

function notFound() {
    function index() {

        function render(params = {}) {
            const {err} = params
            return /* html */ `
            <h1>Page not Found</h1>
            <p>${err}</p>
            `;
        }

        return {render}
    }

    return {index}
}

export {notFound}

## post
// frontend/src/admin/pages/post.js

// function post() {
//     return /* html */ `
//     <h1>Post</h1>
//     `;
// }
function post() {
    async function index(params = {}) {
        const {postIndex} = await import('./posts/post-index');
        return postIndex(params);
    }

    async function create(params) {
        const {postCreate} = await import('./posts/post-create');
        return postCreate(params);
    }

    async function show(params = {}) {
        //console.log(params)
        const {postShow} = await import('./posts/post-show');
        return postShow(params);
    }

    return {
        index,
        create,
        show
    }
}

export {post}

## index
## create

// frontend/src/admin/pages/posts/post-create.js

function postCreate() {
    return {
        render: renderForm,
        init: init,
    }
}

function renderForm() {
    return /* html */ `
    <form id="postCreate">
        <h2>Post Create</h2>
        <input type="text" name="title"><br>
        <textarea name="description"></textarea><br>
        <button type="submit">Create</button>
    </form>
    `;
}

function init() {
    const form = document.getElementById('postCreate');
    form.addEventListener('submit', (e) => {
        e.preventDefault()
    })
}

async function requestServer(form) {
    const formData = new FormData(form);
    const response = await fetch('')
}

export {postCreate}

