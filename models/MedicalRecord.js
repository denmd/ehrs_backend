const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  title: String,
  description: String,
  name: String,
  data: Buffer,
  contentType: String,
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
