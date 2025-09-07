// frontend/src/admin/core/adminRouter.js
//import { dashboard } from "../pages/dashboard";
import { routes } from "../pages/routes";
function adminRouter(mainContent) {
    // Initial page load
    // const initialUrl = window.location.pathname;
    // const searchString = window.location.search;
    // console.log(searchString)
    // if (initialUrl === '/admin/' && !searchString) {
    //     renderContent(mainContent, '/admin/');
    // } else {
    //     renderContent(mainContent, initialUrl);
    // }

    // Initial page load
    // const initialUrl = window.location.pathname + window.location.search;
    const initialUrl = window.location.pathname + window.location.search;
    // if(window.location.pathname !== '/admin/') {
    //     console.log('Route không đúng vui lòng đọc tại tài liệu');
    //     return;
    // }
    searchStringhandler(initialUrl, mainContent);

    const routes = document.querySelectorAll('a');
    routes.forEach(route => {
        route.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.getAttribute('href');
            history.pushState(null, null, url);
            //console.log(href);
            //renderContent(mainContent, url);
            searchStringhandler(url, mainContent);

        });
    });
    window.addEventListener('popstate', () => {
        const currentUrl = window.location.pathname + window.location.search;
        searchStringhandler(currentUrl, mainContent)
        //renderContent(mainContent, currentUrl)
        //console.log(currentUrl);
    });
}

// async function renderContent(mainContent, url) {
//     const urlPath = url.split('/').filter(path => path !== '' && path !== 'admin');

//     // Dựa vào phần đầu tiên của URL để xác định route

//     // const routeName = urlPath[0] || '/';
//     const routeName = urlPath[0] || '/';
//     console.log(routeName)

//     let routesFunction;
//     // Set the default route
//     if (routeName === '/') {
//         routesFunction = routes.dashboard;
//     } else {
//         routesFunction = routes[routeName]();
//     }

//     if (routesFunction) {
//         console.log(routesFunction)
//         //mainContent.innerHTML = routesFunction();
//         const content = await routesFunction.index();
//         mainContent.innerHTML = content();
//         //console.log(content)
//     } else {
//         mainContent.innerHTML = routes.notFound();
//     }
//     //console.log(routesFunction)
//     //console.log(routes);
//     //mainContent.innerHTML = url
// }

function searchStringhandler(url, mainContent) {
    const urlSplit = url.split('?');
    const pathname = urlSplit[0];
    //console.log(pathname)
    // Lấy phần query string sau dấu '?'
    let queryString = urlSplit[1];
    if (pathname !== '/admin/') {
        // console.log('Route không đúng vui lòng đọc tại tài liệu');
        // return;
        queryString = 'p=notFound&v=index&err=Route không đúng vui lòng đọc tại tài liệu.'
    }
    if (!queryString) {
        queryString = 'p=dashboard&v=index'
    }
    // Tạo đối tượng URLSearchParams từ chuỗi
    const searchString = new URLSearchParams(queryString);

    const pageName = searchString.get('p');
    const viewName = searchString.get('v');
    let params = {};

    // Lặp qua từng cặp key-value
    for (const [key, value] of searchString) {
        if (key !== 'p' && key !== 'v') {
            params[key] = value;
        }
    }
    //console.log(pageName, viewName, params);
    // render renderContent
    renderContent(pageName, viewName, params, mainContent)
}

async function renderContent(pageName, viewName, params, mainContent) {
    //console.log(routes[pageName]);
    //console.log(viewName)
    const pageFunction = routes[pageName];
    // Kiểm tra xem pageFunction có tồn tại và là một hàm không
    if (typeof pageFunction === 'function') {
        // Bước 1: Gọi hàm pageFunction() để lấy đối tượng chứa các hàm con (index, create, etc.)
        const pageViewModule = pageFunction();
        //console.log(pageViewModule)
        //console.log(viewName)
        // Bước 2: Lấy hàm xử lý viewName từ đối tượng vừa lấy được
        const viewFunction = pageViewModule[viewName];
        //console.log(viewFunction)
        if (typeof viewFunction === 'function') {
            //console.log(viewFunction);
            //console.log(params)
            try {
                const content = await viewFunction(params);
                //console.log(content);
                mainContent.innerHTML = content;
            } catch (err) {
                console.error(err);
                params.err = `Lỗi hệ thống ${err}`;
                mainContent.innerHTML = routes.notFound().index(params);

            }
        } else {
            params.err = `Không tìm thấy: v=${viewName} trong: p=${pageName}`;
            mainContent.innerHTML = routes.notFound().index(params);
        }
    } else {
        //routes['notFound'];
        params.err = `Trang không tồn tại: p=${pageName}`;
        mainContent.innerHTML = routes.notFound().index(params);
    }
}
export { adminRouter }