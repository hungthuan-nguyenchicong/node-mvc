// backend/core/ApiAdmin.js
import path from 'path';
class ApiAdmin {
    constructor(req, res) {
        this.init(req, res);
    }

    async init(req, res) {
        // this.req = req;
        // this.res = res;
        //this.init(); // You could even call init from the constructor
        //console.log(req._parsedOriginalUrl)
        const url = req._parsedOriginalUrl;
        const searchString = url.search;
        const UrlSearchParams = new URLSearchParams(searchString);

        // xử lý chuỗi

        let controllerString = null;
        const params = {};

        // xu ly truyen key -> value
        if (UrlSearchParams) {
            for (const [key, value] of UrlSearchParams) {
                if (key.includes('@')) {
                    controllerString = key;
                } else {
                    params[key] = value;
                }
            }
            // xử lý controllerString
            if (controllerString) {
                const [controllerName, methodName] = controllerString.split('@');
                // console.log(controllerString)
                // console.log(controllerName, methodName)
                const controllerFile = path.resolve(process.cwd(), `../backend/controllers/${controllerName}.js`);
                try {
                    const controllerModule = await import(controllerFile);
                    if (typeof controllerModule[controllerName] === 'function') {
                        const controllerInstance = new controllerModule[controllerName](req, res);
                        if (typeof controllerInstance[methodName] === 'function') {
                            controllerInstance[methodName](params);
                        } else {
                            const err = `Không tìm thấy: ${methodName} -> trong: ${controllerName}`;
                            console.log(err);
                            return res.status(500).json({err:err});
                        }
                    } else {
                        const err = `Không tìm thấy class name: ${controllerName}`
                        console.log(err);
                        return res.status(500).json({err:err})
                    }
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({err:err.code});
                }
                //console.log(controllerFile)
            }
        }
    }
}

export {ApiAdmin}