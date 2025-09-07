// frontend/src/admin/js/leftSidebar.js

function leftSidebar() {
    document.addEventListener('adminRouter', (e) => {
        const href = e.detail.url;
        const leftSidebar = document.querySelector('.left-sidebar');

        // Chọn tất cả các thẻ <a> trong .left-sidebar
        const links = leftSidebar.querySelectorAll('a');
        links.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    })
}

export {leftSidebar}