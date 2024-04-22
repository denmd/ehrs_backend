
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const medicalRecordsRouter = require('./routes/medical-record');
const smartcontractRouter = require('./routes/contractRoutes');
const DoctorListroutes=require('./routes/Doctorlist.js')
const profileRouter = require('./routes/patientprofile.js'); // Assuming the router file is named 'profile.js' and located in the 'routes' folder
const Patientlistrouter=require('./routes/Patientlist.js')
const session = require('express-session');
const { getUserIDFromDatabase } = require('./middleware/useridsession.js');
const cors = require('cors');
const app = express();


const mongodbURI = process.env.MONGODB_URI
const port = process.env.PORT
app.use(cors());
app.use(session({
  secret: 'my_secret_key_for_session_security',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true

});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(getUserIDFromDatabase);
app.use('/auth', authRoutes);
app.use('/patientprofile', profileRouter);
app.use('/Doctorlist',DoctorListroutes);
app.use('/medical-record', medicalRecordsRouter);
app.use('/contractRoutes', smartcontractRouter); 
app.use('/patientlist',Patientlistrouter)

app.get("/api/",(req, res)=>{
  res.status(200).json({message: "API Alive"})
})


app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
