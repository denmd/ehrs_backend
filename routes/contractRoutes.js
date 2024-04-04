const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545'); 

const contractABI = require('../../smartcontracts/build/contracts/Upload.json').abi;
const contractAddress = '0x9E5142bBd72FF6832f890574A5eBf8D6bBA44fC3'

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
        const { user, url } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.add(user, url).send({ from: accounts[8] });
        res.json({ success: true, message: 'URL added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post('/allow', async (req, res) => {
    try {
        const { user } = req.body;
        const accounts = await web3.eth.getAccounts();
        
        const gasLimit = 6000000; 
        await contract.methods.allow(user).send({ from: accounts[8], gas: gasLimit });

        res.json({ success: true, message: 'Access allowed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



router.post('/disallow', async (req, res) => {
    try {
        const { user } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.disallow(user).send({ from: accounts[8] });
        res.json({ success: true, message: 'Access disallowed successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post('/display', async (req, res) => {
    try {
        const { user } = req.body;
        const accounts = await web3.eth.getAccounts();
        if (!user) {
            return res.status(400).json({ success: false, error: 'User address is required' });
        }

        const result = await contract.methods.display(user).call({ from: accounts[8] });
        console.log('Returned result:', result);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.get('/shareAccess', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.shareAccess().call({ from: accounts[8] });
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
