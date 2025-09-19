// frontend/src/admin/libery/quill/toolbar-handlers/handler-image.js

function handlerImage() {
    const uploadFileEvent = new CustomEvent('uploadFile', { detail: { type: 'quill' } });
    document.dispatchEvent(uploadFileEvent);

    // tab-link-actve
    const uploadTabLinkEvent = new CustomEvent('upload-tab-link', { detail: { tabId: 'uploadImage' } });
    document.dispatchEvent(uploadTabLinkEvent);
}

export { handlerImage }