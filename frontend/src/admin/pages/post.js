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

    async function create() {
        const {postCreate} = await import('./posts/post-create');
        return postCreate();
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