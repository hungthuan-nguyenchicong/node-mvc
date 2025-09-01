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

    const response = await fetch('/auth/login', {
        method: "POST",
        body: formData,
    });

    const result = await response.json();
    console.log(result);
}

export {login}