// frontend/src/admin/mainAdmin.js
import './scss/adminMainScss.scss';
import { btnLogout } from "../utils/btnLogout";
// test sidebar
import { leftSidebar } from './js/leftSidebar';
// adminRouter
import { adminRouter } from './core/adminRouter';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.log('no div#mainContent');
        return;
    }
    btnLogout();
    leftSidebar();

    // adminRouter
    adminRouter(mainContent);
});