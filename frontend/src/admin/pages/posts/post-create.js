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