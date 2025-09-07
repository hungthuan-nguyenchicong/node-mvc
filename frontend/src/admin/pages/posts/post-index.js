// frontend/src/admin/pages/posts/post-index.js

async function postIndex(params = {}) {
    //console.log(params)
    return await renderContent(params)
}

async function renderContent(params = {}) {
    const {id = ''} = params;
    return /* html */ `
    <h1>helo ${id}</h1>
    `;
}

export {postIndex}