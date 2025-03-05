const express = require('express');
const router = express.Router();
const Driver = require('../models/driverSchema'); // Import the Driver model

router.get('/', function(req, res){
    try {
        res.render('index', {
            nav: [
                {link: '/results', title: 'Results'},
                {link: '/question', title: 'Questions'}
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
        res.render('results', { drivers }); // Pass the drivers to the template
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/question', function(req, res){
    try {
        res.render('question', {
            nav: [
                {link: '/results', title: 'Results'},
                {link: '/question', title: 'Questions'}
            ],
        title: 'Questions'
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;