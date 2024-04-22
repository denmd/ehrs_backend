
const express = require('express');
const { Doctor, Patient } = require('../models/User'); 


const router = express.Router();

router.get('/user-profile', async (req, res) => {
  try {
  console.log(req.headers)
    const userId = req.headers['x-userid'];
    console.log(userId)
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not provided in headers' });
    }
   
   
    const doctorProfile = await Doctor.findById(userId);
    const patientProfile = await Patient.findById(userId);
    
    if (doctorProfile) {
      
      const doctorData = {
        name: doctorProfile.name,
        specialization: doctorProfile.specialization,
        email:doctorProfile.email,
        EthereumAddress: doctorProfile.EthereumAddress
        
      };
      return res.status(200).json(doctorData);
    } else if (patientProfile) {
      
      const patientData = {
        name: patientProfile.name,
        email: patientProfile.email,
        age: patientProfile.age,
        gender: patientProfile.gender,
        EthereumAddress: patientProfile.EthereumAddress
       
      };
      return res.status(200).json(patientData);
    } else {
      
      return res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});


module.exports = router;
