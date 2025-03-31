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

        // // Budget (answers[0])
        // if (answers[0]) {
        //     const budgetRange = answers[0].replace(/[^0-9 -]/g, '').split(' - ');
        //     if (budgetRange.length === 2) {
        //         const budget = parseInt(budgetRange[1]);
        //         if (!isNaN(budget)) {
        //             query.price = { $lte: budget }; // Filter by budget
        //         }
        //     }
        // }

        // // Driving distance (answers[1])
        // if (answers[1]) {
        //     const distance = answers[1];
        //     if (distance === '< 200 yards') {
        //         query.loft = { $gte: 11, $lte: 12 }; // Loft range for < 200 yards
        //     } else if (distance === '200 - 225 yards') {
        //         query.loft = { $gte: 10.5, $lte: 12 }; // Loft range for 200 - 225 yards
        //     } else if (distance === '225 - 250 yards') {
        //         query.loft = { $gte: 9.5, $lte: 10.5 }; // Loft range for 225 - 250 yards
        //     } else if (distance === '250 - 275 yards') {
        //         query.loft = { $gte: 9, $lte: 10.5 }; // Loft range for 250 - 275 yards
        //     } else if (distance === '> 275 yards') {
        //         query.loft = { $gte: 8, $lte: 9.5 }; // Loft range for > 275 yards
        //     }
        // }

        // // Swing speed (answers[2])
        // if (answers[2]) {
        //     const swingSpeed = answers[2];
        //     if (swingSpeed === 'Slow') {
        //         query.swing_speed = 'Slow'; // Filter for slow swing speed
        //     } else if (swingSpeed === 'Medium') {
        //         query.swing_speed = 'Average'; // Filter for medium swing speed
        //     } else if (swingSpeed === 'Fast') {
        //         query.swing_speed = 'Fast'; // Filter for fast swing speed
        //     }

        // }

        // // Launch preference (answers[3])
        // if (answers[3]) {
        //     const launchPreference = answers[3];
        //     if (launchPreference === 'High') {
        //         query.launch = 'High'; // Filter for high launch
        //     } else if (launchPreference === 'Medium') {
        //         query.launch = 'Mid'; // Filter for medium launch
        //     } else if (launchPreference === 'Low') {
        //         query.launch = 'Low'; // Filter for low launch
        //     }
        // }

        // // Shot shape (answers[4])

        if (answers[0]) {
            const shotShape = answers[0];
            if (shotShape === 'Slice') {
                query.shot_shape_bias = 'Draw Bias'; // Filter for draw bias
            } else if (shotShape === 'Fade') {
                query.shot_shape_bias = { $in: ['Draw Bias', 'Neutral'] }; // Filter for draw bias and neutral
            } else if (shotShape === 'Straight') {
                query.shot_shape_bias = 'Neutral'; // Filter for neutral
            } else if (shotShape === 'Draw') {
                query.shot_shape_bias = { $in: ['Fade Bias', 'Neutral'] }; // Filter for fade bias and neutral
            } else if (shotShape === 'Hook') {
                query.shot_shape_bias = 'Fade Bias'; // Filter for fade bias
            }
        }

        // Biggest Struggle (answers[5])

        if (answers[1]) {
            const struggle = answers[1];
            if (struggle === 'Distance') {
                query.launch = { $in: ['Low', 'Mid']} // Filter for distance
            } else if (struggle === 'Accuracy') {
                query.forgiveness = { $in: ['High', 'Very High']}; // Filter for accuracy
            } else if (struggle === 'Consistency') {
                query.forgiveness = { $in: ['High', 'Very High']}; // Filter for consistency
            } else if (struggle === 'Control') {
                query.forgiveness = 'Moderate'; // Filter for control
            }
        }

        // if (answers[4]) {
        //     query.shot_shape_bias = answers[4];
        // }

        // // Struggles (answers[5])
        // if (answers[5]) {
        //     query.forgiveness = answers[5];
        // }

        // Brand Filter (answers[6])
        if (answers[4]) {
            const brand = answers[4];
            console.log(`Selected brand: ${brand}`); // Debugging statement
            if (brand.toLowerCase() === 'callaway') {
                query.brand = 'Callaway'; // Filter by Callaway brand
            } else if (brand.toLowerCase() === 'ping') {
                query.brand = 'Ping'; // Filter by Ping brand
            } else if (brand.toLowerCase() === 'titleist') {
                query.brand = 'Titleist'; // Filter by Titleist brand
            } else if (brand.toLowerCase() === 'taylormade') {
                query.brand = 'TaylorMade'; // Filter by TaylorMade brand
            } else if (brand.toLowerCase() === 'cobra') {
                query.brand = 'Cobra'; // Filter by Cobra brand
            } else if (brand.toLowerCase() === 'pxg') {
                query.brand = 'PXG'; // Filter by PXG brand
            } else {
                // Do not filter by brand if "Other/No Preference" is selected
                console.log('No specific brand preference. Including all brands.');
            }
        }

        // Query the database
        const drivers = await Driver.find(query);
        console.log(`Number of drivers retrieved: ${drivers.length}`); // Log the count of drivers

        // Render the results page with the filtered drivers
        res.render('results', { drivers, answers});
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