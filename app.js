
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const medicalRecordsRouter = require('./routes/medical-record');
const smartcontractRouter = require('./routes/contractRoutes');
const session = require('express-session');
const { getUserIDFromDatabase } = require('./middleware/useridsession.js');
const app = express();


const mongodbURI = process.env.MONGODB_URI
const port = process.env.PORT

app.use(session({
  secret: 'my_secret_key_for_session_security',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
   
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(getUserIDFromDatabase);
app.use('/auth', authRoutes);
app.use('/medical-record', medicalRecordsRouter);
app.use('/contractRoutes', smartcontractRouter); 



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
