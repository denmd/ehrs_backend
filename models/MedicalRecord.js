const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dateUploaded: {
    type: Date,
    default: Date.now
  },        
  description: String,
  fileName: String 
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
