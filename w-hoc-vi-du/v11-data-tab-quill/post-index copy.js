// frontend/src/admin/pages/posts/post-index.js
//import { pageTransform } from "../../utils/pageTransform";
async function postIndex() {
    //console.log(params)
    return {
        render: renderContent,
        init: init,
    }
}

async function renderContent(params = {}) {
    return /* html */ `
    <h2>Post Index</h2>
    <table border=1 id="showPosts">
        <thead>
            <tr>
                <th>Post Title</th>
                <th>Post Description</th>
                <th>Post Show</th>
                <th>Action Edit</th>
                <th>Action Delete</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    `;
}

async function init() {
    const response = await fetch('/api-admin/?PostController@show_posts');
    if (!response.ok) {
        console.error(500);
    }
    const result = await response.json();
    //console.log(result);
    renderTbody(result)
}

function renderTbody(posts) {
    const table = document.getElementById('showPosts');
    const tbody = table.querySelector('tbody');

    // Xóa nội dung cũ trong tbody trước khi thêm nội dung mới
    tbody.innerHTML = '';
    // lặp nội dung

    posts.forEach(post => {
        // Tạo một hàng mới (<tr>) cho mỗi bài viết
        const row = document.createElement('tr');
        // Tạo ô cho tiêu đề bài viết td
        const titleCell = document.createElement('td');
        titleCell.innerText = post.post_title;

        // Tạo ô cho nội dung bài viết
        const descCell = document.createElement('td');
        descCell.innerText = post.post_description;
        
        //them show
        const showCell = document.createElement('td');
        const btnShow = document.createElement('button');
        btnShow.innerText = 'Show';
        btnShow.setAttribute('data-post-id', post.post_id);
        clickBtnShow(btnShow);
        showCell.appendChild(btnShow);


        // them edit
        const editCell = document.createElement('td');
        const btnEdit = document.createElement('button');
        btnEdit.innerText = 'Edit';
        btnEdit.setAttribute('data-post-id', post.post_id);
        editCell.appendChild(btnEdit)
        // thêm sự kiện click btnEdit
        clickBtnEdit(btnEdit);

        // them delete
        const deleteCell = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnDelete.setAttribute('data-post-id', post.post_id);
        deleteCell.appendChild(btnDelete);
        // su kien clic
        clickBtnDelete(btnDelete);

        // Thêm các ô vào hàng
        row.appendChild(titleCell);
        row.appendChild(descCell);
        row.appendChild(showCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell);

        // Thêm hàng vào tbody
        tbody.appendChild(row);

    });

}

function clickBtnShow(btnShow) {
    btnShow.addEventListener('click', (e) => {
        //pageTransform();
        const postId = e.target.dataset.postId;
        const newUrl = `/admin/?p=post&v=show&id=${postId}`;
        window.history.pushState(null, null, newUrl);

        const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
        document.dispatchEvent(adminRouterEvent);
    })
}

function clickBtnEdit(btnEdit) {
    btnEdit.addEventListener('click', (e) => {
        //console.log(1)
        const postId = e.target.dataset.postId;
        //console.log(postId)
        const newUrl = `/admin/?p=post&v=edit&id=${postId}`;
        const userConfirmed = window.confirm('bạn có chắc sửa không');
        if (userConfirmed) {
            window.history.pushState(null, null, newUrl);
            // add listener router
            const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
            document.dispatchEvent(adminRouterEvent);
        }
    });
}

function clickBtnDelete(btnDelete) {
    btnDelete.addEventListener('click', async (e) => {
        const userConfirmed = window.confirm('Bạn có chắc chắn xóa không');
        if (userConfirmed) {
            const postId = e.target.dataset.postId;
            try {
                const response = await fetch(`/api-admin/?PostController@delete_post&id=${postId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    if(response.status === 405) {
                        return alert('Phương thức gửi không phù hợp');
                    }
                    //console.log(response)
                    return alert('Lỗi hệ thống')
                }
                const result = await response.json();
                if (result.success) {
                    alert('Đã xóa thành công');
                    const newUrl = `/admin/?p=post&v=index`;
                    window.history.pushState(null, null, newUrl);
                    const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
                    document.dispatchEvent(adminRouterEvent);
                }
            } catch (err) {
                console.error(err);
            }
        }
    });
}

export {postIndex}