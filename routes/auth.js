const express = require('express');
const bcrypt = require('bcrypt');
const { Doctor, Patient } = require('../models/User');
const uuid = require('uuid');
const router = express.Router();

// Doctor Signup
router.post('/doctor/signup', async (req, res) => {
  try {
    const { username, password , name, specialty,EthereumAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctorId = uuid.v4();
    const newDoctor = new Doctor({ username, password: hashedPassword, name, specialty,EthereumAddress, doctorId });
    await newDoctor.save();
    req.session.doctorId = doctorId;
    res.status(201).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Error creating doctor' });
  }
});

// Doctor Signin
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
    req.session.doctorId = doctor.doctorId;
    res.status(200).json({ message: 'Doctor signin successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
});

// Patient Signup
router.post('/patient/signup', async (req, res) => {
  try {
    const { username, password, name , age , EthereumAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const patientId = uuid.v4();
    const newPatient = new Patient({ username, password: hashedPassword, patientId ,name , age , EthereumAddress });
    await newPatient.save();
    req.session.patientId = patientId;
    res.status(201).json({ message: 'Patient created successfully' });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Error creating patient' });
  }
});

// Patient Signin
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

// Signout
router.post('/signout', (req, res) => {
  // Destroy the session
  req.session.destroy();
  res.status(200).json({ message: 'Signout successful' });
});

module.exports = router;
