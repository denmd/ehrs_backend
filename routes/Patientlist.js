
const express = require('express');
const router = express.Router();

const Patient = require('../models/User').Patient;
const MyPatient = require('../models/Mypatient');



router.get('/patients', async (req, res) => {
    try {
      const patients = await Patient.find();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  

router.post('/add-patient', async (req, res) => {
    const { patientId } = req.body;
    const userId = req.headers['x-userid']; // Assuming user ID is sent in the request headers

    try {
        // Find the patient by ID
        const patient = await Patient.findById(patientId);
        
        // Store patient details in MyDoctor schema
        const Mypatient = await MyPatient.findOneAndUpdate(
            { userId: userId }, // Find the user document using user ID
            { $push: { patients: patient } }, // Add patient details to the patients array in the user document
            { new: true, upsert: true } // Create the user document if it doesn't exist
        );

        res.status(200).json({ message: 'Patient added successfully', Mypatient });
    } catch (error) {
        // Handle errors
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/get-patients', async (req, res) => {
    const userId = req.headers['x-userid']; // Assuming doctor ID is sent in the request headers
  
    try {
      // Find patients associated with the doctor
      const myPatients = await MyPatient.findOne({ userId }).populate('patients');;
      res.json(myPatients);
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;
  