# md phat va lang nge sidebar
## phat
const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:url}});
    document.dispatchEvent(adminRouterEvent);

## nghe

    document.addEventListener('adminRouter', (e) => {
        const href = e.detail.url;


const links = leftSidebar.querySelectorAll('a');
        links.forEach(link => {
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });