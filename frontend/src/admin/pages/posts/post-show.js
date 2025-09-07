// frontend/src/admin/pages/posts/post-show.js

function postShow(params = {}) {
    //console.log(params)
    return /* html */ `
    <h1>Post Show</h1>
    <p>param: ${params.id}</p>
    `;
}

export {postShow}