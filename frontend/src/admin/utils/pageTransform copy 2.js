// frontend/src/admin/utils/pageTransform.js
import './pageTransform.scss';
function pageTransform() {
    const divTransform = document.createElement('div');
    divTransform.classList.add('page-transform');
    document.body.appendChild(divTransform);
    
    setTimeout(() => {
        setTimeout(() => {
             divTransform.classList.add('in')
        }, 1);
        setTimeout(() => {
             document.body.classList.add('active')
        }, 500);
    }, 1)
}

export { pageTransform }