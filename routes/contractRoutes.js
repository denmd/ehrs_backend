const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');

// Initialize Web3 with Ganache HTTP provider
const web3 = new Web3('http://127.0.0.1:7545'); // Assuming Ganache is running on the default port 7545

// Load Contract ABI and Address
const contractABI = require('../../smartcontracts/build/contracts/AccessControl.json').abi;
const contractAddress = '0xdb19E2f495a7DEc1B46e3D5e17C3a4526081C0a5'

// Instantiate Contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Route handler to grant access to a doctor
router.post('/grantAccess', async (req, res) => {
    try {
        console.log(req.body)
        const doctorAddress = req.body.doctorAddress;
        console.log(doctorAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.grantAccess(doctorAddress).send({ from: accounts[0] });
        res.json({ success: true, message: 'Access granted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Route handler to revoke access from a doctor
router.post('/revokeAccess', async (req, res) => {
    try {
        const { doctorAddress } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.revokeAccess(doctorAddress).send({ from: accounts[0] });
        res.json({ success: true, message: 'Access revoked successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
