# npm i express-form-data

npm i express-form-data

import express from 'express';
import formData from 'express-form-data';

const app = express();
const port = 3000;

// Middleware to handle form data, including file uploads
app.use(formData.parse());

app.post('/upload', (req, res) => {
  console.log('Fields:', req.body);
  console.log('Files:', req.files);
  
  res.send('File upload handled successfully!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});