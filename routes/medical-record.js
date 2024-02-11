const express = require('express');
const router = express.Router();
const multer = require('multer');
const MedicalRecord = require('../models/MedicalRecord');
const fs = require('fs');



const uploadDir = './files';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}


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

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const { filename } = req.file;
    await MedicalRecord.create({ title, description, fileName: filename});
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ error: 'Failed to upload file' });
  }
});

module.exports = router;
