// app.js or index.js
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const medicalRecordsRouter = require('./routes/medical-record');
const app = express();


const mongodbURI = process.env.MONGODB_URI
const port = process.env.PORT

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

app.use('/auth', authRoutes);
app.use('/medical-record', medicalRecordsRouter);



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
