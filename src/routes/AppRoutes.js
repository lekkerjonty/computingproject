const express = require('express');
const path = require('path');
const router = express.Router();
const Driver = require('../models/driverSchema'); 
const Shaft = require('../models/shaftSchema');

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
        
        // Define the questions and their explanations
        const questions = [
            {
                question: "What is your budget?",
            },
            {
                question: "What is your average driving carry distance?",
                explanations: {
                    "< 200 yards": "You may benefit from higher lofted clubs for more distance. We Recommend a driver with a loft of 11-12 degrees.",
                    "200 - 225 yards": "You could benefits from slightly high lofted clubs for more distance. We Recommend 10.5-12 degrees.",
                    "225 - 250 yards": "You have a good driving distance. Therefore, you may benefit from a driver with a loft of 9.5-10.5 degrees.",
                    "250 - 275 yards": "You have an above-average driving distance. We recommend a driver with a loft of 9-10.5 degrees.",
                    "> 275 yards": "You have an excellent driving distance. We recommend a driver with a lower loft of between 8-9.5 degrees."
                }
            },
            {
                question: "How would you describe your swing speed?",
                explanations: {
                    "Slow": "You may benefit from clubs/shafts that are built for slower swing speeds.",
                    "Average": "You may benefit from clubs/shafts that are built for average swing speeds.",
                    "Fast": "You may benefit from clubs/shafts that are built for faster swing speeds."
                }
            },
            {
                question: "Do you hit the ball low, medium, or high?",
                explanations: {
                    "Low": "You may benefit from clubs that promote higher launch.",
                    "Medium": "You have a balanced ball flight. Therefore, you may benefit from a driver with a medium launch.",
                    "High": "You may benefit from clubs that promote lower launch."
                }
            },
            {
                question: "What is your most common shot shape?",
                explanations: {
                    "Slice": "You may benefit from clubs with a draw bias.",
                    "Fade": "You may benefit from neutral or draw-biased clubs.",
                    "Straight": "You have a consistent shot shape. Therefore, you may benefit from neutral clubs.",
                    "Draw": "You may benefit from neutral or fade-biased clubs.",
                    "Hook": "You may benefit from clubs with a fade bias."
                }
            },
            {
                question: "What is your biggest struggle with your current driver?",
                explanations: {
                    "Distance": "You may benefit from clubs designed for maximum distance.",
                    "Accuracy": "You may benefit from clubs with higher forgiveness.",
                    "Consistency": "You may benefit from clubs with a stable design.",
                    "Trajectory": "You may benefit from clubs with adjustable loft.",
                    "Feel": "You may benefit from clubs with improved feedback."
                }
            },
            {
                question: "Finally, is there a specific brand you prefer?",
            }
        ];

        // Construct the query based on all the answers
        const query = {};

            // Budget (answers[0])
        if (answers[0] && answers[0] !== "Don't Mind") {
        const budgetAnswer = answers[0];
        const budget = parseInt(budgetAnswer.replace(/[^0-9]/g, '')); // Extract the numeric value from the answer

        if (budgetAnswer.startsWith('<')) {
            // Handle "< £X"
            query.price = { $lte: budget };
        } else if (budgetAnswer.includes('-')) {
            // Handle "£X - £Y"
            const [min, max] = budgetAnswer.split('-').map(val => parseInt(val.replace(/[^0-9]/g, '')));
            query.price = { $gte: min, $lte: max };
        } else if (budgetAnswer.endsWith('+')) {
            // Handle "£X+"
            query.price = { $gte: budget };
        }

        console.log(`Filtering by budget: ${JSON.stringify(query.price)}`);
        } else {
            console.log('Skipping budget filter as the user selected "Don\'t Mind".');
        }
        

        // Driving distance (answers[1])
        if (answers[1]) {
            const distance = answers[1];
            if (distance === '< 200 yards') {
                query.loft = { $gte: 11, $lte: 12 }; // Loft range for < 200 yards
            } else if (distance === '200 - 225 yards') {
                query.loft = { $gte: 10.5, $lte: 12 }; // Loft range for 200 - 225 yards
            } else if (distance === '225 - 250 yards') {
                query.loft = { $gte: 9.5, $lte: 10.5 }; // Loft range for 225 - 250 yards
            } else if (distance === '250 - 275 yards') {
                query.loft = { $gte: 9, $lte: 10.5 }; // Loft range for 250 - 275 yards
            } else if (distance === '> 275 yards') {
                query.loft = { $gte: 8, $lte: 9.5 }; // Loft range for > 275 yards
            }
            console.log(`Filtering by driving distance: Loft range ${JSON.stringify(query.loft)}`);
        }

        // Swing speed (answers[2])
        if (answers[2]) {
            const swingSpeed = answers[2];
            if (swingSpeed === 'Slow') {
                query.swing_speed = 'Slow'; // Filter for slow swing speed
            } else if (swingSpeed === 'Average') {
                query.swing_speed = 'Average'; // Filter for medium swing speed
            } else if (swingSpeed === 'Fast') {
                query.swing_speed = 'Fast'; // Filter for fast swing speed
            }
            console.log(`Filtering by swing speed: ${query.swing_speed}`);
        }

        // Launch preference (answers[3])
        if (answers[3]) {
            const launchPreference = answers[3];
            if (launchPreference === 'High') {
                query.launch = 'Low'; // Filter for high launch
            } else if (launchPreference === 'Medium') {
                query.launch = 'Mid'; // Filter for medium launch
            } else if (launchPreference === 'Low') {
                query.launch = 'High'; // Filter for low launch
            }
            console.log(`Filtering by launch preference: ${query.launch}`);
        }

        // Shot shape (answers[4])
        if (answers[4]) {
            const shotShape = answers[4];
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
            console.log(`Filtering by shot shape: ${JSON.stringify(query.shot_shape_bias)}`);
        }

        // Biggest struggle (answers[5])
    if (answers[5]) {
        const struggle = answers[5];
    try {
        if (struggle === 'Distance') {
            query.launch = { $in: ['Low', 'Mid'] };
            query.adjustability = true; // Include adjustability for fine-tuning
        } else if (struggle === 'Accuracy') {
            query.forgiveness = { $in: ['High', 'Very High'] };
            query.shot_shape_bias = { $in: ['Neutral', 'Draw Bias'] }; // Depending on user shot shape
        } else if (struggle === 'Consistency') {
            query.forgiveness = { $in: ['High', 'Very High'] };
            query.adjustability = true; // Adjustable options to fine-tune performance
        } else if (struggle === 'Trajectory') {
            query.launch = { $in: ['Mid-High', 'High'] }; // For low trajectory struggles
            // Optionally add loft filtering as well
        } else if (struggle === 'Feel') {
            query.forgiveness = 'Moderate';
            query.adjustability = true; // Adjustable options for customization
        }
        console.log(`Filtering by biggest struggle: ${struggle}`);
    } catch (error) {
        console.error('Error filtering by biggest struggle:', error);
        res.status(500).send('Internal Server Error');
    }
}


        // Brand Filter (answers[6])
        if (answers[6]) {
            const brand = answers[6];
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

       
        // Query the database for all drivers
        const allDrivers = await Driver.find({});
        console.log(`Total drivers retrieved: ${allDrivers.length}`);

        // Calculate match percentage and missing criteria for each driver
        const criteriaKeys = Object.keys(query);
        const driversWithMatchPercentage = allDrivers.map(driver => {
            let matchCount = 0;
            const missingCriteria = [];

            // Check each criterion
            criteriaKeys.forEach(key => {
                if (query[key]) {
                    if (typeof query[key] === 'object' && query[key].$lte !== undefined && query[key].$gte !== undefined) {
                        // Range filter (e.g., loft)
                        if (driver[key] >= query[key].$gte && driver[key] <= query[key].$lte) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    } else if (typeof query[key] === 'object' && query[key].$in) {
                        // $in filter (e.g., shot shape bias)
                        if (query[key].$in.includes(driver[key])) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    } else {
                        // Exact match filter
                        if (driver[key] === query[key]) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    }
                }
            });

            // Calculate match percentage
            const matchPercentage = Math.round((matchCount / criteriaKeys.length) * 100);

            // Add match percentage and missing criteria to the driver object
            return { ...driver.toObject(), matchPercentage, missingCriteria };
        });

        // Sort drivers by match percentage (descending)
        driversWithMatchPercentage.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Generate explanations based on the user's answers
        questions.forEach((q, index) => {
            if (answers[index] && q.explanations) {
                // Use the explanation for the specific answer
                q.explanation = q.explanations[answers[index]] || "";
            } else {
                // Provide a default explanation if the answer is missing or explanations are not defined
                q.explanation = "";
            }
        });

        // Separate primary and secondary recommendations
        const primaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage === 100);
        const secondaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage < 100 && driver.matchPercentage >= 75);
        const tertiaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage < 75 && driver.matchPercentage >= 50);

        console.log(`Primary recommendations count: ${primaryRecommendations.length}`);
        console.log(`Secondary recommendations count: ${secondaryRecommendations.length}`);

        // Render the results page with both primary and secondary recommendations
        res.render('results', { primaryRecommendations, secondaryRecommendations, tertiaryRecommendations, answers, questions});
        }   catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/selectShafts', async (req, res) => {
    try {
        const shafts = await Shaft.find({});
        console.log(`Number of shafts retrieved: ${shafts.length}`); // Log the count of shafts
        res.render('selectShafts', { shafts });
    } catch (error) {
        console.error('Error rendering selectShafts page:', error);
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