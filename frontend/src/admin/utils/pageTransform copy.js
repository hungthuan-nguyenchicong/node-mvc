// frontend/src/admin/utils/pageTransform.js
import './pageTransform.scss';
function pageTransform() {
    const divTransform = document.createElement('div');
    divTransform.classList.add('page-transform');
    document.body.appendChild(divTransform);

    setTimeout(() => {
        setTimeout(() => {
            divTransform.classList.add('in')
        });
        setTimeout(() => {
            divTransform.classList.add('active')
        }, 2000);
    }, 1)
}

export { pageTransform }