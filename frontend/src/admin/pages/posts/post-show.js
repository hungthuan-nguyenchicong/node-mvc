// frontend/src/admin/pages/posts/post-show.js

function postShow() {

    return {
        render: renderContent,
        init: requestServer
    }
    //console.log(params)

}

function renderContent() {
    return /* html */ `
    <h1>Post Show</h1>
    <div class="err-message"></div>
    <div id="showPost"></div>
    `;
}

async function requestServer(params = {}) {
    const { id = null } = params;
    const errMessage = document.querySelector('.err-message');
    try {
        const response = await fetch(`/api-admin/?PostController@show_post&id=${id}`);
        if (!response.ok) {
            console.log(response)
            return errMessage.innerHTML = 'Lỗi hệ thống';
        }
        const result = await response.json();
        if (result.err) {
            return errMessage.innerHTML = result.err;
        }
        renderShowPost(result);
    } catch (err) {
        console.log(err);
    }
}

function renderShowPost(post) {
    const showPost = document.getElementById('showPost');
    const content = /* html */ `
    <h2>${post.post_title}</h2>
    <div>${post.post_description}</div>
    `;
    showPost.innerHTML = content;
}
export { postShow }