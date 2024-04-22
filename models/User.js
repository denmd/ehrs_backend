const mongoose = require('mongoose');

  const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true ,unique: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true }, 
    EthereumAddress:{type: String, required: true },
    phnno: { type: String, required: true } 
  });

const Doctor = mongoose.model('Doctor', doctorSchema);

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  EthereumAddress: { type: String, required: true }
});


const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Doctor, Patient };
