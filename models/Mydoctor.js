const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myDoctorSchema = new Schema(
   { 
    userId: {
        type: Schema.Types.ObjectId, 
        required: true
      },
  name: {
    type: String,
    required: true
  },
  
specialization: {
    type: String,
    required: true
  },
  EthereumAddress: {
    type: String,
    required: true},
    hasAccess: {
        type: Boolean,
        default: false
      },
});

const MyDoctor = mongoose.model('MyDoctor', myDoctorSchema);

module.exports = MyDoctor;
