// backend/server.js

import express from 'express';

const app = express();
const port = 3000;

// Middleware để phân tích JSON request body
app.use(express.json());

// Định nghĩa một route cơ bản
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Lắng nghe cổng đã định nghĩa
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});