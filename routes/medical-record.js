const express = require('express');
const multer = require('multer');
const MedicalRecord = require('../models/MedicalRecord');
const fs = require('fs');
const router = express.Router();


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
    await MedicalRecord.create({ title, description, filename });
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send({ error: 'Failed to upload  file' });
  }
});


router.get('/download/:title', async (req, res) => {
  try {
    const { title } = req.params;

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
    res.setHeader('Content-Type', 'application/pdf'); 


    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    res.setHeader('Title', title);
    res.setHeader('Description', description);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send({ error: 'Failed to download  file' });
  }
});


module.exports = router;
