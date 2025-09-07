// frontend/src/admin/core/adminRouter.js
//import { dashboard } from "../pages/dashboard";
import { routes } from "../pages/routes";
function adminRouter(mainContent) {
    // Initial page load
    const initialUrl = window.location.pathname;
    const searchString = window.location.search;
    console.log(searchString)
    if (initialUrl === '/admin/') {
        renderContent(mainContent, '/admin/');
    } else {
        renderContent(mainContent, initialUrl);
    }

    const routes = document.querySelectorAll('a');
    routes.forEach(route => {
        route.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.target.getAttribute('href');
            history.pushState(null, null, url);
            //console.log(href);
            renderContent(mainContent, url)
        });
    });
    window.addEventListener('popstate', () => {
        const currentUrl = window.location.pathname;
        renderContent(mainContent, currentUrl)
        //console.log(currentUrl);
    });
}

async function renderContent(mainContent, url) {
    const urlPath = url.split('/').filter(path => path !== '' && path !== 'admin');

    // Dựa vào phần đầu tiên của URL để xác định route

    // const routeName = urlPath[0] || '/';
    const routeName = urlPath[0] || '/';
    console.log(routeName)

    let routesFunction;
    // Set the default route
    if (routeName === '/') {
        routesFunction = routes.dashboard;
    } else {
        routesFunction = routes[routeName]();
    }

    if (routesFunction) {
        console.log(routesFunction)
        //mainContent.innerHTML = routesFunction();
        const content = await routesFunction.index();
        mainContent.innerHTML = content();
        //console.log(content)
    } else {
        mainContent.innerHTML = routes.notFound();
    }
    //console.log(routesFunction)
    //console.log(routes);
    //mainContent.innerHTML = url
}
export {adminRouter}