const express = require('express');
const router = express.Router();
const Driver = require('../models/driverSchema'); // Import the Driver model
// const Iron = require('../models/ironSchema'); // Import the Iron model

router.get('/', function(req, res){
    try {
        res.render('index', {
            nav: [
                {link: '/results', title: 'Results'},
                {link: '/question', title: 'Questions'},
                {link: '/irons', title: 'Irons'}
            ],
        title: 'Home'
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/results', async (req, res) => {
    try {
        console.log('Connecting to MongoDB...');
        const drivers = await Driver.find(); // Fetch all drivers from MongoDB
        console.log('Fetched drivers:', drivers); // Debugging statement
        if (drivers.length === 0) {
            console.log('No drivers found in the database.');
        }
        res.render('results', { drivers }); // Pass the drivers to the template
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/irons', async (req, res) => {
//     try {
//         console.log('Connecting to MongoDB...');
//         const irons = await Iron.find(); // Fetch all irons from MongoDB
//         console.log('Fetched irons:', irons); // Debugging statement
//         if (irons.length === 0) {
//             console.log('No irons found in the database.');
//         }
//         res.render('irons', { irons }); // Pass the irons to the template
//     } catch (error) {
//         console.error('Error fetching irons:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get('/driverQuestions', function(req, res){
    try {
        res.render('driverQuestions', {
        title: 'Driver Questions'
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;