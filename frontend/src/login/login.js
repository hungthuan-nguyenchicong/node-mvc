// frontend/src/login/login.js

function login() {
    const form = document.getElementById('login');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    });
    console.log(1)
}

async function requestServer(form) {
    const formData = new FormData(form);
    try {
        const response = await fetch('/auth/login',{
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.log(err)
    }

}

export {login}