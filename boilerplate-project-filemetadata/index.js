// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create the uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();

app.use(cors());

// multer configuration to save uploaded files to the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve the HTML form
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// File upload and analysis route
// The upload.single('upfile') middleware handles the file upload
// The 'upfile' string must match the 'name' attribute of your file input in the HTML form
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  // req.file is the file object created by multer
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // The file metadata is available in req.file
  // We return the original name, mimetype, and size in bytes
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});