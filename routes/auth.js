const express = require('express');
const bcrypt = require('bcrypt');
const { Doctor, Patient } = require('../models/User');
const router = express.Router();

function generateSessionToken() {
 
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return token;
}


router.post('/doctor/signup', async (req, res) => {
  try {
    const { password , name, specialization, EthereumAddress ,phnno,email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({  password: hashedPassword, name,specialization ,EthereumAddress,phnno,email});
    const savedDoctor = await newDoctor.save(); 

    req.session.userId = savedDoctor._id;
    res.status(201).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Error creating doctor' });
  }
});


router.post('/doctor/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const sessionToken = generateSessionToken();
    req.session.doctorId = doctor._id;
    req.session.ethereumAddress = doctor .EthereumAddress;
    req.session.sessionToken = sessionToken;
    const userId =  req.session.doctorId
    res.status(200).json({ message: 'Doctor signin successful',sessionToken,userId });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error signing in' });
  }
});


router.post('/patient/signup', async (req, res) => {
  try {
    const { name, password, age, email, gender, EthereumAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({ 
      name, 
      password: hashedPassword,  
      age, 
      email, 
      gender, 
      EthereumAddress 
    });
    const savedPatient = await newPatient.save();
    req.session.patientId = savedPatient._id;
    res.status(201).json({ message: 'Patient created successfully' });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Error creating patient' });
  }
});


router.post('/patient/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const sessionToken = generateSessionToken();
    req.session.patientId = patient._id;
    req.session.ethereumAddress = patient.EthereumAddress;
    req.session.sessionToken = sessionToken;
    const userId=req.session.patientId
    
    res.status(200).json({ message: 'Patient signin successful',sessionToken,userId });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Error signing in' });
  }
});

router.get('/test', (req, res) => {
  try {
   
    console.log(req.session)
    const userId = req.session.patientId;
    const address=req.session.ethereumAddress
  
    if (userId && address) {
      res.status(200).json({ userId ,address});
    } else {
    
      res.status(404).json({ error: 'User ID not found in session' });
    }
  } catch (error) {
   
    console.error('Error retrieving user ID from session:', error);
    res.status(500).json({ error: 'Error retrieving user ID from session' });
  }
});

router.post('/check-account', async (req, res) => {
  try {
    const { account, userId } = req.body;

    const patient = await Patient.findOne({ EthereumAddress: account,  _id: userId });

    res.json({ exists: patient });
  } catch (error) {
    console.error('Error checking account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signout', (req, res) => {
 
  req.session.destroy();
  res.status(200).json({ message: 'Signout successful' });
});

module.exports = router;
