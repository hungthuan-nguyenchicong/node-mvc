// frontend/src/admin/utils/pageTransform.js
import './pageTransform.scss';
function pageTransform() {
    setTimeout(() => {
        document.body.classList.add('page-transform');
        setTimeout(() => {
            document.body.classList.remove('page-transform');
        }, 2000)
    });
}

export { pageTransform }