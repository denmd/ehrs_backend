const express = require('express');
const multer = require('multer');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/User').Patient;
const contractRouter = require('./contractRoutes');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const patientId = req.headers['x-userid'];
 

    const { originalname, buffer, mimetype } = req.file;

    const file = new MedicalRecord({
      title,
      description,
      name: originalname,
      data: buffer,
      contentType: mimetype,
      patientId: patientId
    });

    await file.save();
    //const patient = await Patient.findOne({ _id: patientId });
    //const ethereumAddress = patient.EthereumAddress;
   //console.log(ethereumAddress)
   //console.log('heyy')
    //await axios.post('http://localhost:8000/contractRoutes/add', { user: ethereumAddress, url: patientId });
    res.status(201).send({ message: 'File uploaded successfully.', patientId: patientId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
  }
});

router.get('/files/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params; 
    const files = await MedicalRecord.find({ patientId }); 
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files from the database.');
  }
});


router.use(express.static(__dirname));

module.exports = router;
