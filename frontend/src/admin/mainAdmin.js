// frontend/src/admin/mainAdmin.js
import './scss/adminMainScss.scss';
import { btnLogout } from "../utils/btnLogout";
// test sidebar
import { leftSidebar } from './js/leftSidebar';

document.addEventListener('DOMContentLoaded', () => {
    btnLogout();
    leftSidebar();
});