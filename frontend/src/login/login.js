// frontend/src/login/login.js

function login() {
    const form = document.getElementById('login');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    });
}

async function requestServer(form) {
    const formData = new FormData(form);
    const errMess = form.querySelector('.error-message');
    try {
        const response = await fetch('/auth-login/',{
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            form.reset();
            window.location.href = '/admin/'
        }
        
        if (result.err) {
            errMess.innerHTML = 'Tên đăng nhập hoặc mật khẩu không đúng';
        }
    } catch (err) {
        console.log(err);
        errMess.innerHTML = 'Lỗi hệ thống vui lòng thử lại sau';
    }

}

export {login}