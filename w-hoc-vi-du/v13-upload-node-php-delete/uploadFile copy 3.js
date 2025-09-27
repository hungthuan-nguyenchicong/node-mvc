// frontend/src/admin/core/uploadFile.js
import './uploadFile.scss';
import { uploadTab } from './parts/upload-tab';
function uploadFile() {
    document.addEventListener('uploadFile', (e) => {
        renderUpload();
    })
}

// function renderForm() {
//     // 1. Kiểm tra xem thẻ input đã tồn tại hay chưa
//     const existingInput = document.querySelector('input[name="file"]');
//     // 2. Nếu chưa tồn tại, thì mới tạo thẻ mới
//     if (!existingInput) {
//         const inputElemet = document.createElement('input');
//         inputElemet.setAttribute('type', 'file');
//         inputElemet.setAttribute('name', 'file');
//         document.body.appendChild(inputElemet);
//     }
// }

function renderUpload() {
    const existingUploadContent = document.querySelector('.upload-content');
    if (!existingUploadContent) {
        const uploadContent = document.createElement('div');
        uploadContent.classList.add('upload-content');
        uploadContent.classList.add('active');
        uploadContent.innerHTML = renderUploadContent();
        document.body.appendChild(uploadContent);
    }
    const uploadContent = document.querySelector('.upload-content');
    uploadContent.classList.add('active');
    initUpload(uploadContent);
}

function renderUploadContent() {
    return /* html */ `
    <button type="button" uploadClose>x</button>
    <div class="tab">
        <button class="tab-links" data-tab-link="uploadImage">Upload Image</button>
        <button class="tab-links" data-tab-link="galleryImages">Gallery images</button>
    </div>
    <div class="tab-contents" data-tab-content="uploadImage">
        <form id="uploadForm">
            <input type="file" name="file"><br>
            <button type="submit">Upload Image</button>
            <div class="err-message"></div>
        </form>
    </div>
    <div class="tab-contents" data-tab-content="galleryImages">
        <div>Gallery images content</div>
    </div>
    `;
}

function initUpload(uploadContent) {
    clicBtnClose(uploadContent);
    uploadTab(uploadContent);
    submitForm();
}

function clicBtnClose(uploadContent) {
    const btnClose = uploadContent.querySelector('button[uploadClose]');
    btnClose.addEventListener('click', (e) => {
        uploadContent.classList.remove('active');
    })
}

function submitForm() {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestUploadForm(form);
    })
}

async function requestUploadForm(form) {
    try {
        const formData = new FormData(form);
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        let errMessage = form.querySelector('.err-message');
        const response = await fetch('/api-upload-node/', {
            //const response = await fetch('http://localhost/api-upload-php/', {

            method: 'POST',
            headers: {
                // Thêm header tùy chỉnh với tên file
                'X-File-Name': file.name
            },
            body: formData
        });
        if (!response.ok) {

            // const result = await response.json();
            // //console.log(response)
            // if (result.err) {
            //     const errMessage = form.querySelector('.err-message');
            //     return errMessage.innerHTML = result.err;
            // }
            return errMessage.innerHTML = response.status;
        }
        const result = await response.json();
        if (result.err) {
            return errMessage.innerHTML = result.err;
        }
        console.log(result);
        renderImage(form, result)
    } catch (err) {
        console.error(err);
    }
}

function renderImage(form, result) {
    const divImg = document.createElement('div');


    const img = /* html */ `
    <img src="${result.src}" alt="">
    `;
    divImg.innerHTML = img;
    form.appendChild(divImg);
}

export { uploadFile }