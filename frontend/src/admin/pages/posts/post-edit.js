// frontend/src/admin/pages/posts/post-edit.js
//import { adminRouterEvent } from "../../core/adminRouter";
function postEdit() {
    return {
        render: renderContent,
        init: requestServer,
    }
}

function renderContent() {
    return /* html */ `
    <h2>Post Edit</h2>
    <div class="err-message"></div>
    <form id="postEdit"></form>
    `;
}

async function requestServer(params = {}) {
    const {id = null} = params;
    const errMessage = document.querySelector('.err-message');
    //console.log(id)
    try {
        const response = await fetch(`/api-admin/?PostController@show_post&id=${id}`);
        if (!response.ok) {
            return errMessage.innerHTML = 'Lỗi hệ thống'
        }
        const result = await response.json();
        if (result.err) {
            return errMessage.innerHTML = result.err;
        }
        //console.log(result)
        renderPostEdit(result, id);
    } catch (err) {
        console.error(err);
    }
}

function renderPostEdit(post, postId) {
    const form = document.getElementById('postEdit');
    const content = /* html */ `
    <input type="text" name="title" value="${post.post_title}"><br>
    <textarea name="description">${post.post_description}</textarea><br>
    <button type="submit">Update</button>
    <button type="button" class="btn-cancel">Cancel</button><br>
    <div class="err-message"></div>
    <div class="countdown"></div>
    `;
    form.innerHTML = content;
    btnCancelEdit(form);
    formSubmitUpdate(form, postId)
}

function btnCancelEdit(form) {
    const btnCancel = form.querySelector('.btn-cancel');
    btnCancel.addEventListener('click', () => {
        //console.log(1)
        const newUrl = `/admin/?p=post&v=index`;
        adminRouterEvent(newUrl);
        // window.history.pushState(null, null, newUrl);
        // const adminRouter = 
    });
}

function formSubmitUpdate(form, postId) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const errMessage = form.querySelector('.err-message');
        try {
            const response = await fetch(`/api-admin/?PostController@update_post&id=${postId}`, {
                method: "PUT",
                body: formData,
            });
            if (!response.ok) {
                //console.error(response);
                return errMessage.innerHTML = 'Lỗi hệ thống';
            }
            const result = await response.json();
            //console.log(result);
            if (result.success) {
                errMessage.innerHTML = 'Update thành công';
                countdown(form);
            }
        } catch (err) {
            console.error(err);
        }
    });

}

function countdown(form) {
    const countdownElement = form.querySelector('.countdown');
    const delayInSeconds = 3;
    let countdownValue = delayInSeconds;

    // cập nhật hiển thị
    countdownElement.textContent = countdownValue;

    // Hàm đếm ngược và cập nhật hiển thị
    function updateCountdown() {
        countdownElement.textContent = countdownValue;
        countdownValue --;
    }

    // Cập nhật đếm ngược mỗi giây
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Sử dụng setTimeout để chờ và sau đó chuyển hướng

    setTimeout(() => {
        // Dừng bộ đếm ngược để tránh hiển thị giá trị âm
        clearInterval(countdownInterval);
        // Chuyển hướng đến URL đích
        const newUrl = `/admin/?p=post&v=index`;
        window.history.pushState(null, null, newUrl);
        const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
        document.dispatchEvent(adminRouterEvent);
    }, delayInSeconds * 1000);
}
export {postEdit}