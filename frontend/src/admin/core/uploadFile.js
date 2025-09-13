// frontend/src/admin/core/uploadFile.js
import './uploadFile.scss';
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
    <form id="uploadForm">
        <input type="file" namw="file"><br>
        <button type="submit">Upload Image</button>
    </form>
    `;
}

function initUpload(uploadContent) {
    clicBtnClose(uploadContent);
    submitForm()
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
        reqestUploadForm(form)
    })
}

async function reqestUploadForm(form) {
    const formData = new FormData(form);
    const response = await fetch('/api-upload-node/', {
        method: 'POST',
        body: formData 
    });
    const result = await response.json();
    console.log(result);
}

export {uploadFile}