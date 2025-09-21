# bắt phản hồi và điều chỉnh phản hồi từ php -> node -> client

npm i http-proxy-middleware

# xử lý header -> từ client -> node -> php

https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/proxy-events.md

on.proxyReq

const { createProxyMiddleware } = require('http-proxy-middleware');

const onProxyReq = function (proxyReq, req, res) {
  // add new header to request
  proxyReq.setHeader('x-added', 'foobar');
};

const options = {
  target: 'http://localhost:3000',
  on: { proxyReq: onProxyReq },
};

const apiProxy = createProxyMiddleware(options);

# xử lý bắt -> php -> node -> client
https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/response-interceptor.md

Manipulate JSON responses (application/json);

## note
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

 selfHandleResponse: true,

## code

const proxy = createProxyMiddleware({
  target: 'http://jsonplaceholder.typicode.com',
  changeOrigin: true, // for vhosted sites

  selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()

  on: {
    proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      // detect json responses
      if (proxyRes.headers['content-type'] === 'application/json') {
        let data = JSON.parse(responseBuffer.toString('utf8'));

        // manipulate JSON data here
        data = Object.assign({}, data, { extra: 'foo bar' });

        // return manipulated JSON
        return JSON.stringify(data);
      }

      // return other content-types as-is
      return responseBuffer;
    }),
  },
});

# use

app.use('/api-upload-node/', imageControllerInstance.insert, apiProxy);

constructor() {
        this.insert = this.insert.bind(this)
    }

async insert(req, res, next) {
        // Chỉ xử lý các request POST
        if (req.method === 'POST') {
            try {
                console.log('Đang thực hiện logic database...');
                // --- Ghi dữ liệu vào database ở đây ---
                // const imageController = new ImageController();
                // await imageController.saveImageToDb(req.body);
                // -------------------------------------

                // Giả định rằng việc ghi database thành công
                const isDbWriteSuccessful = true;

                if (isDbWriteSuccessful) {
                    console.log('Ghi database thành công. Chuyển tiếp tới proxy.');
                    // Gọi next() để chuyển request tới middleware tiếp theo (apiProxy)
                    return next();
                } else {
                    // Nếu ghi database thất bại, trả về lỗi ngay lập tức
                    console.log('Ghi database thất bại. Đã dừng request.');
                    return res.status(500).json({ err: 'Failed to write to database' });
                }
            } catch (dbError) {
                console.error('Lỗi database:', dbError);
                // Bắt lỗi và trả về phản hồi lỗi
                return res.status(500).json({ err: 'Internal Server Error', details: dbError.message });
            }
        }

        // Nếu không phải là POST, chỉ gọi next() và trả về JSON cho client
        //next();

        // Nếu không phải là POST, chỉ gọi next()
        return res.status(405).json({ err: 405 });
    }
