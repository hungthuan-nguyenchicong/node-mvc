// frontend/src/admin/pages/post.js

// function post() {
//     return /* html */ `
//     <h1>Post</h1>
//     `;
// }
function post() {
    async function index() {
        const {postIndex} = await import('./posts/post-index');
        return postIndex();
    }

    async function create() {
        const {postCreate} = await import('./posts/post-create');
        return postCreate()
    }

    return {
        index,
        create
    }
}

export {post}