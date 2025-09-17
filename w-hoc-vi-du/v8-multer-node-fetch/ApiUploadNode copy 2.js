// backend/core/ApiUploadNode.js
import fetch from "node-fetch";
// npm install form-data
//import FormData from "form-data";
class ApiUploadNode {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.clientFetchNode();
    }

    async clientFetchNode() {
        if (this.req.method === "POST") {
            // 1. Kiểm tra header Content-Type của request gốc để đảm bảo là multipart/form-data
            const contentType = this.req.headers['content-type'];
            //return this.res.json({node:'ok'});
            const response = await fetch('http://localhost/api-upload-php/', {
                method: "POST",
                headers: {
                    'X-From-Node': 'true',
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*'
                },
                body: this.req,
            });
            const result = await response.json();
            console.log(result)
            console.log(this.req.files);
            // console.log(this.req.headers['content-type']);
            //const result = await re
            return this.res.json(result);
            //return this.res.json({ res: 'ok' });
        }
        return this.res.status(405).json({ err: 405 });
    }
}

export { ApiUploadNode }