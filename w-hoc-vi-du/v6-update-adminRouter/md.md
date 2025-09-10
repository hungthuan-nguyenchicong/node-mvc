## update listener adminRouter

const linkHref = e.target.getAttribute('href');
            window.history.pushState(null, null, linkHref);
            //console.log(linkHref)
            //searchStringhandler(linkHref, mainContent);
            const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:linkHref}});
            document.dispatchEvent(adminRouterEvent);

// listen adminRouter
    document.addEventListener('adminRouter', (e) => {
        searchStringhandler(e.detail.url, mainContent);
    });

const postId = e.target.dataset.postId;
        //console.log(postId)
        const newUrl = `/admin/?p=post&v=show&id=${postId}`;
        const userConfirmed = window.confirm('bạn có chắc sửa không');
        if (userConfirmed) {
            window.history.pushState(null, null, newUrl);
            // add listener router
            const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:newUrl}});
            document.dispatchEvent(adminRouterEvent);
        }