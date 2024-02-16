const express = require('express');
const router = express.Router();
const multer = require('multer');
const MedicalRecord = require('../models/MedicalRecord');
const fs = require('fs');
const crypto = require('crypto'); // Import crypto module for encryption

const getSessionUserId = (req, res, next) => {
  req.userId = req.session.userId; // Attach userId to the request object
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

const upload = multer({ storage: storage });
router.use(getSessionUserId);
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const { filename } = req.file;
    const userId = req.userId;

  
    await MedicalRecord.create({ title, description, filename,userId });
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ error: 'Failed to upload  file' });
  }
});

// Route to download decrypted file
router.get('/download/:title', async (req, res) => {
  try {
    const { title } = req.params;

    // Find the medical record with the matching title
    const medicalRecord = await MedicalRecord.findOne({ title });

    if (!medicalRecord) {
      return res.status(404).send({ error: 'Medical record not found' });
    }

    const { fileName, description } = medicalRecord;
    

    const filePath = './files/' + fileName;
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ error: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${FileName}"`);
    res.setHeader('Content-Type', 'application/pdf'); // Set content type if the file is a PDF

    // Stream the file content directly to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Send additional information (title and decrypted description) in response headers
    res.setHeader('Title', title);
    res.setHeader('Description', description);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send({ error: 'Failed to download  file' });
  }
});


module.exports = router;
