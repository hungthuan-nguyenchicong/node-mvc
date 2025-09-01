// frontend/src/login/login.js

// frontend/login/login.js

function login() {
    const form = document.getElementById('login');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        //console.log(1)
        requestServer(form)
    })
}

async function requestServer(form) {
    const formData = new FormData(form);
    try {
        const response = await fetch('/auth/login', {
            method: "POST",
            body: formData,
        });
    
        const result = await response.json();
        //console.log(result);
        if (result.success) {
            form.reset();
            return window.location = '/admin/';
        }

        if (result.error) {
            const errorMessage = form.querySelector('.error-message');
            return errorMessage.innerHTML = 'Tài khoản hoặc mật khấu không đúng';
        }

    } catch (e) {
        console.log(e);
    }

}

export {login}