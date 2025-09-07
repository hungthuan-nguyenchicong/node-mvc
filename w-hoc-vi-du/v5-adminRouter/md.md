# Router Admin
    //initial page load
    const initialUrl = window.location.pathname + window.location.search;

        const aLinks = document.querySelectorAll('a');

            const linkHref = e.target.getAttribute('href');


            window.history.pushState(null, null, linkHref);


    window.addEventListener('popstate', () => {

## routes

// frontend/src/admin/pages/routes.js
import { dashboard } from "./dashboard";
import { notFound } from "./notFound";
import { post } from "./post";


export const routes = {
    dashboard: dashboard,
    notFound: notFound,
    post: post,
}

// export {routes}

## search String

function searchStringhandler(url, mainContent) {


    const splitUrl = url.split('?');
    const pathname = splitUrl[0];
    let searchString = splitUrl[1];


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

## render 

async function renderContent(pageName, viewName, params, mainContent) {

    const pageModule = routes[pageName];

if (typeof pageModule === 'function') {
        const pageFunction = pageModule();

                const viewModule = pageFunction[viewName];

            const viewContent = await viewModule(params);



