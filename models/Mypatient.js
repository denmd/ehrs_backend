const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myPatientSchema = new Schema({
    userId: {
        type: String, // Assuming userId is a string
        required: true
    },
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient' // Reference to the Patient model
    }]
});

const MyPatient = mongoose.model('MyPatient', myPatientSchema);

module.exports = MyPatient;
