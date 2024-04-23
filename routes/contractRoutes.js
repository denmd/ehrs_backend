const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');
const Patient = require('../models/User').Patient;
const doctor = require('../models/User').Doctor;
const MyDoctor=require('../models/Mydoctor');
const axios = require('axios');


const provider = new Web3.providers.HttpProvider('https://rpc-amoy.polygon.technology/'); // Use your Amoy RPC URL here
const web3 = new Web3(provider);

const contractABI = require('../models/deploy/Upload.json').abi;
const contractAddress = '0x205CAB2b1ADC1af2Eca5Efb2f421F182ef4d2709'

console.log("Contract Address:", contractAddress);
const contract = new web3.eth.Contract(contractABI, contractAddress);
web3.eth.isSyncing().then(syncing => {
    if (syncing) {
        console.log("Node is syncing with the network:");
        console.log("Current block:", syncing.currentBlock);
        console.log("Highest block:", syncing.highestBlock);
        console.log("Starting block:", syncing.startingBlock);
    } else {
        console.log("Node is fully synced with the network.");
    }
}).catch(error => {
    console.error("Error:", error);
});

router.post('/add', async (req, res) => {
    try {
        console.log('heyy')
        const { user, url } = req.body;
        await contract.methods.add(user, url).send({ from: user });
        res.json({ success: true, message: 'URL added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post('/allow', async (req, res) => {
    try {
      
        const { user } = req.body;
        console.log(user)
        const userId=req.headers['x-userid'];
        console.log(userId)
        const patient = await Patient.findById(userId);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        const owner=patient.EthereumAddress
        
        const gasLimit = 6000000; 
        await contract.methods.allow(user).send({ from: owner, gas: gasLimit });
        const updatedDoctor = await MyDoctor.findOneAndUpdate(
            { userId,EthereumAddress: user }, 
            { hasAccess: true },
            { new: true } 
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        
        res.json({ success: true, message: 'Access allowed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



router.post('/disallow', async (req, res) => {
    try {
        console.log('readyy1')
        const { user } = req.body;
        const userId=req.headers['x-userid'];
        const patient = await Patient.findById(userId);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        const owner=patient.EthereumAddress
        
        await contract.methods.disallow(user).send({ from: owner });
        
        await MyDoctor.updateOne({ userId,EthereumAddress: user }, { hasAccess: false });
        console.log('readyy')
        res.json({ success: true, message: 'Access disallowed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post('/display', async (req, res) => {
    try {
        const { owner } = req.body;
         const userId=req.headers['x-userid'];
         const Doctor = await doctor.findById(userId);
         const patient = await Patient.findById(userId);
         let user;
         if (Doctor ) {
             user = Doctor.EthereumAddress
         }
         else if(patient){
             user = patient.EthereumAddress
         }
        
        if (!user) {
            return res.status(400).json({ success: false, error: 'User address is required' });
        }

        const result = await contract.methods.display(owner).call({ from: user});
        console.log('Returned result:', result);
        const patientId = result[0];
       
        const filesResponse = await axios.get(`https://ehrs-backend.onrender.com/medical-record/files/${patientId}`);
        const filesData = filesResponse.data;
        res.json({ success: true, data: filesData });
       
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.get('/shareAccess', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.shareAccess().call({ from: accounts[5] });
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
