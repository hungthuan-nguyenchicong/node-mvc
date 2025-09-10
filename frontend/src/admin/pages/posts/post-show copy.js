// frontend/src/admin/pages/posts/post-show.js

function postShow() {

    return {
        render: renderContent,
    }
    //console.log(params)
    
}

function renderContent(params = {}) {
    return /* html */ `
    <h1>Post Show</h1>
    <p>param: ${params.id}</p>
    `;
}
export {postShow}