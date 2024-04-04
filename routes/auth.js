const express = require('express');
const bcrypt = require('bcrypt');
const { Doctor, Patient } = require('../models/User');
const router = express.Router();


router.post('/doctor/signup', async (req, res) => {
  try {
    const { username, password , name, specialty,EthereumAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ username, password: hashedPassword, name, specialty,EthereumAddress});
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
    const { username, password } = req.body;
    const doctor = await Doctor.findOne({ username });

    if (!doctor) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.userId = doctor._id;
    res.status(200).json({ message: 'Doctor signin successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
});


router.post('/patient/signup', async (req, res) => {
  try {
    const { username, password, name , age , EthereumAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({ username, password: hashedPassword, patientId ,name , age , EthereumAddress });
    await newPatient.save();
    req.session.patientId = patientId;
    res.status(201).json({ message: 'Patient created successfully' });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Error creating patient' });
  }
});


router.post('/patient/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.patientId = patient.patientId;
    res.status(200).json({ message: 'Patient signin successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
});
router.get('/test', (req, res) => {
  try {
    // Retrieve user ID from session
    const userId = req.session.userId;

    // If user ID exists in session, respond with it
    if (userId) {
      res.status(200).json({ userId });
    } else {
      // If user ID does not exist in session, respond with error
      res.status(404).json({ error: 'User ID not found in session' });
    }
  } catch (error) {
    // If any error occurs, respond with error status
    console.error('Error retrieving user ID from session:', error);
    res.status(500).json({ error: 'Error retrieving user ID from session' });
  }
});


router.post('/signout', (req, res) => {
 
  req.session.destroy();
  res.status(200).json({ message: 'Signout successful' });
});

module.exports = router;
