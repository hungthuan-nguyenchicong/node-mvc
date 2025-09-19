// frontend/src/admin/libery/quill/quillJs.js

import "quill/dist/quill.snow.css";
import Quill from 'quill';
import { handlerImage } from "./toolbar-handlers/handler-image";
function quillJs() {
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],

        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']
    ];

    const toolbarHandlers = {
        // Correctly define custom handlers directly within the object
        image: handlerImage,
    };

    const quill = new Quill('#editor', {
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: toolbarHandlers
            },
        },
        theme: 'snow'
    });

    const editorElement = document.getElementById('editor');
    if (editorElement) { // Added a check to ensure the element exists
        editorElement.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
        });
    }
}

export { quillJs };