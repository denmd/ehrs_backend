
const express = require('express');
const router = express.Router();
const Doctor = require('../models/User').Doctor;
const MyDoctor = require('../models/Mydoctor'); 

router.get('/doctors', async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');
    const userId = req.headers['x-userid'];
    
    const doctor = await Doctor.findOne({ name: regex });

    if (doctor) {
    
      const newMyDoctor = new MyDoctor({
        userId: userId,
        name: doctor.name, 
specialization: doctor.specialization,
        EthereumAddress:doctor.EthereumAddress
        
      });
      await newMyDoctor.save();

      
      res.json(newMyDoctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/mydoctors', async (req, res) => {
  try {
    const userId = req.headers['x-userid'];
   
    const doctors = await MyDoctor.find({ userId: userId });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/updateHasAccess', async (req, res) => {
  const { EthereumAddress, hasAccess } = req.body;
  const userId = req.headers['x-userid'];
  try {
    const doctor = await MyDoctor.findOneAndUpdate(
      { EthereumAddress, userId },
      { hasAccess },
      { new: true }
    );
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});
module.exports = router;
