// frontend/src/admin/utils/btnLogout.js

function btnLogout() {
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', async () => {
        try {
            const response = await fetch('/auth-logout/', {method: "POST"});
            const result = await response.json();
            //console.log(result);
            if (result.success) {
                window.location.href = '/login/';
            }
        } catch (err) {
            console.log(err);
        }
    })
}

export {btnLogout}