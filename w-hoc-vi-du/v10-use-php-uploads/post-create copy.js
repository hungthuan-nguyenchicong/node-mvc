// frontend/src/admin/pages/posts/post-create.js
//import { pageTransform } from "../../utils/pageTransform";
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
        <input type="text" name="title" required><br>
        <textarea name="description" required></textarea><br>
        <button type="submit">Create</button>
        <div class="err-message"></div>
    </form>
    `;
}

function init() {
    const form = document.getElementById('postCreate');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    })
}

async function requestServer(form) {
    const formData = new FormData(form);
    const errMessage = form.querySelector('.err-message');
    try {
        const response = await fetch('/api-admin/?PostController@create&id=5&page=5', {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            if (response.status === 405) {
                return errMessage.innerHTML = 'Vui Lòng chọn phương thức hợp lệ';
            }
            return errMessage.innerHTML = 'Lỗi hệ thống'
        }
        const result = await response.json();
        if (result.err) {
            return errMessage.innerHTML = result.err;
        }
        if (result.success) {
            alert('Đã thêm thành công');
            form.reset();
            const newUrl = '/admin/?p=post&v=index';
            window.history.pushState(null, null, newUrl);
            const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
            document.dispatchEvent(adminRouterEvent);
        }
    } catch (err) {
        console.error(err);
        errMessage.innerHTML = err;
    }
}

export { postCreate }