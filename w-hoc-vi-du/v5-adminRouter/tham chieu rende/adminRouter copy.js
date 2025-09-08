// frontend/src/admin/core/adminRouter.js
import { routes } from "../pages/routes";
function adminRouter(mainContent) {
    //initial page load
    const initialUrl = window.location.pathname + window.location.search;
    searchStringhandler(initialUrl, mainContent)
    //console.log(initialUrl)

    // a link SPA for /admin/
    const aLinks = document.querySelectorAll('a');
    aLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkHref = e.target.getAttribute('href');
            window.history.pushState(null, null, linkHref);
            //console.log(linkHref)
            searchStringhandler(linkHref, mainContent);
        });
    });

    // nut tới và lui trufnh duyet -> wwindow -> popstate
    window.addEventListener('popstate', () => {
        const currentUrl = window.location.pathname + window.location.search;
        searchStringhandler(currentUrl, mainContent);
    });
}

function searchStringhandler(url, mainContent) {
    const splitUrl = url.split('?');
    const pathname = splitUrl[0];
    let searchString = splitUrl[1];

    // khởi tạo searchString cho default -> /admin/
    
    if (pathname === '/admin/' && !searchString) {
        searchString = 'p=dashboard&v=index';
    }

    if (pathname !== '/admin/') {
        searchString = 'p=notFound&v=index&err=Route không đúng vui lòng đọc tại tài liệu.'
    }

    // Tạo đối tượng URLSearchParams từ chuỗi
    const queryString = new URLSearchParams(searchString);
    // lấy các giá trị
    const pageName = queryString.get('p');
    const viewName = queryString.get('v');
    // lấy params
    let params = {};
    for (const [key, value] of queryString) {
        if(key !== 'p' & key !== 'v') {
            params[key] = value;
        }
    }
    renderContent(pageName, viewName, params, mainContent);
    //console.log(pageName, viewName, params);

    // phát sự kiện để sidebar bắt sự kiện css theo

    const adminRouterEvent = new CustomEvent('adminRouter', {detail:{url:url}});
    document.dispatchEvent(adminRouterEvent);
}

async function renderContent(pageName, viewName, params, mainContent) {
    const pageModule = routes[pageName];

    if (typeof pageModule === 'function') {
        const pageFunction = pageModule();

        const viewModule = pageFunction[viewName];
        if (typeof viewModule === 'function') {
            const viewContent = await viewModule(params);
            mainContent.innerHTML = viewContent;
            //console.log(viewContent)
        } else {
            params.err = `Không tìm thấy: v=${viewName} --> trong: p=${pageName}`;
            mainContent.innerHTML = routes.notFound().index(params);
        }
    } else {
        params.err = `Trang không tồn tại: p=${pageName}`
        mainContent.innerHTML = routes.notFound().index(params)
    }
}

export { adminRouter }