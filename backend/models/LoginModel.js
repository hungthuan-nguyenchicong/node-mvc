// backend/models/LoginModel.js

class LoginModel {
    validate(username, password) {
        if (username === 'admin' && password === '123') {
            return true;
        }
        return false;
    }
}

export {LoginModel}