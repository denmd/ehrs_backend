const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
