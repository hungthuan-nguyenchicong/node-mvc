// backend/core/FormData.js
import express_form_data from 'express-form-data';
class ExpressFormData {
    constructor(app) {
        this.formData(app);
    }

    formData(app) {
        app.use(express_form_data.parse());
    }
}

export {ExpressFormData}