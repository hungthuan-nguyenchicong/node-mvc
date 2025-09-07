// frontend/src/admin/js/leftSidebar.js

function leftSidebar() {
    const leftSidebar = document.querySelector('.left-sidebar');
    const links = leftSidebar.querySelectorAll('a')
    links.forEach(link => {
        link.addEventListener('click', () => {
            //console.log(1);
            links.forEach(linkItem => {
                linkItem.classList.remove('active');
            });
            link.classList.add('active');
        })
    })
}

export {leftSidebar}