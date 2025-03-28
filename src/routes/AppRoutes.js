const express = require('express');
const router = express.Router();
const Driver = require('../models/driverSchema'); 
// const Iron = require('../models/ironSchema'); // Import the Iron model

router.get('/', function(req, res){
    try {
        res.render('index', {
        title: 'Home'
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/driverQuestions', (req, res) => {
    try {
        res.render('driverQuestions', { title: 'Driver Questions' });
    } catch (error) {
        console.error('Error rendering driverQuestions page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/results', async (req, res) => {
    try {
        // Extract answers from query parameters
        const answers = Object.values(req.query);
        console.log('Received answers:', answers);

        // Construct the query based on all the answers
        const query = {};

        // Budget (answers[0])
        if (answers[0]) {
            const budgetRange = answers[0].replace(/[^0-9 -]/g, '').split(' - ');
            if (budgetRange.length === 2) {
                const budget = parseInt(budgetRange[1]);
                if (!isNaN(budget)) {
                    query.price = { $lte: budget }; // Filter by budget
                }
            }
        }

        // // Driving distance (answers[1])
        // if (answers[1]) {
        //     const distance = parseInt(answers[1].replace(/[^0-9]/g, ''));
        //     if (!isNaN(distance)) {
        //         query.loft = { $gte: distance }; // Filter by loft
        //     }
        // }

        // // Swing speed (answers[2])
        // if (answers[2]) {
        //     query.swing_speed = answers[2];
        // }

        // // Launch preference (answers[3])
        // if (answers[3]) {
        //     query.launch = answers[3];
        // }

        // // Shot shape (answers[4])
        // if (answers[4]) {
        //     query.shot_shape_bias = answers[4];
        // }

        // // Struggles (answers[5])
        // if (answers[5]) {
        //     query.forgiveness = answers[5];
        // }

        // // Adjustability (answers[6] and beyond)
        // query.adjustability =
        //     answers.includes('Adjustable loft') ||
        //     answers.includes('Adjustable weight') ||
        //     answers.includes('Adjustable hosel');

        // console.log('Constructed query:', query);

        // Query the database
        const drivers = await Driver.find(query);
        console.log(`Number of drivers retrieved: ${drivers.length}`); // Log the count of drivers

        // Render the results page with the filtered drivers
        res.render('results', { drivers, answers });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/results', async (req, res) => {
//     try {
//         // Fetch all drivers without any filters
//         const drivers = await Driver.find({});
//         console.log(`Number of drivers retrieved: ${drivers.length}`); // Log the count of drivers

//         // Render the results page with all the drivers
//         res.render('results', { drivers });
//     } catch (error) {
//         console.error('Error fetching drivers:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
        



module.exports = router;