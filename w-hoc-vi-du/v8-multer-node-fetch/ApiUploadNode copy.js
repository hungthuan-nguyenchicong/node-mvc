// backend/core/ApiUploadNode.js
import fetch from "node-fetch";

class ApiUploadNode {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.clientFetchNode();
    }

    async clientFetchNode() {
        if (this.req.method === "POST") {
            //return this.res.json({node:'ok'});
            const response = await fetch('http://localhost/api-upload-node/', {
                method: "POST",
                headers: {
                    'X-From-Node': 'true',
                },
                body: this.req,
            });
            console.log(response)
            //const result = await response.json();
            //console.log(this.req.files);
            //const result = await re
            //return this.res.json(result);
            return this.res.json({ res: 'ok' });
        }
        return this.res.status(405).json({ err: 405 });
    }
}

export { ApiUploadNode }