// frontend/src/admin/pages/posts/post-index.js

async function postIndex() {
    //console.log(params)
    return {
        render: renderContent,
        init: init,
    }
}

async function renderContent(params = {}) {
    const {id = ''} = params;
    return /* html */ `
    <h1>helo ${id}</h1>
    `;
}

function init() {
    console.log(1)
}

export {postIndex}