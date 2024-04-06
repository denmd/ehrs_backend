const mongoose = require('mongoose');

  const doctorSchema = new mongoose.Schema({
    username: { type: String, required: true ,unique: true },
    password: { type: String, required: true ,unique: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true }, 
    EthereumAddress:{type: String, required: true }
  });

const Doctor = mongoose.model('Doctor', doctorSchema);

const patientSchema = new mongoose.Schema({
  username: { type: String, required: true,unique: true  },
  password: { type: String, required: true ,unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  EthereumAddress:{ type: String, required: true }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Doctor, Patient };
