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
        
        const answers = Object.values(req.query);
        console.log('Received answers:', answers);
        
        
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

        
        const query = {};
        const shaftQuery = {};

            
        if (answers[0] && answers[0] !== "Don't Mind") {
            const budgetAnswer = answers[0];
            const budget = parseInt(budgetAnswer.replace(/[^0-9]/g, '')); // Extract numeric value from the answer
        
            if (budgetAnswer.startsWith('<')) {
                query.price = { $lte: budget }; // Less than or equal to the budget
            } else if (budgetAnswer.includes('-')) {
                const [min, max] = budgetAnswer.split('-').map(val => parseInt(val.replace(/[^0-9]/g, '')));
                query.price = { $gte: min, $lte: max }; // Between min and max
            } else if (budgetAnswer.endsWith('+')) {
                query.price = { $gte: budget }; // Greater than or equal to the budget
            }
        
            console.log(`Filtering by budget: ${JSON.stringify(query.price)}`);
            console.log('Constructed budget query:', query);
        } else {
            console.log('Skipping budget filter as the user selected "Don\'t Mind".');
        }
        

        
        if (answers[1]) {
            const distance = answers[1];
            if (distance === '< 200 yards') {
                query.loft = { $gte: 11, $lte: 12 };
                shaftQuery.flex = { $in: ['Senior', 'Regular'] };
                shaftQuery.weight = { $lte: 55 };
            } else if (distance === '200 - 225 yards') {
                query.loft = { $gte: 10.5, $lte: 12 };
                shaftQuery.flex = { $in: ['Senior', 'Regular'] };
                shaftQuery.weight = { $gte: 55, $lte: 65 };
            } else if (distance === '225 - 250 yards') {
                query.loft = { $gte: 9.5, $lte: 10.5 };
                shaftQuery.flex = { $in: ['Regular', 'Stiff'] };
                shaftQuery.weight = { $gte: 65, $lte: 75 }; 
            } else if (distance === '250 - 275 yards') {
                query.loft = { $gte: 9, $lte: 10.5 };
                shaftQuery.flex = { $in: ['Stiff', ' Extra Stiff'] };
                shaftQuery.weight = { $gte: 75, $lte: 85 };
            } else if (distance === '> 275 yards') {
                query.loft = { $gte: 8, $lte: 9.5 };
                shaftQuery.flex = { $in: [' Extra Stiff'] };
                shaftQuery.weight = { $gte: 85 }; 
            }
            console.log(`Filtering by driving distance: Loft range ${JSON.stringify(query.loft)}`);
        }

        
        if (answers[2]) {
            const swingSpeed = answers[2];
            if (swingSpeed === 'Slow') {
                query.swing_speed = 'Slow'; 
            } else if (swingSpeed === 'Average') {
                query.swing_speed = 'Average'; 
            } else if (swingSpeed === 'Fast') {
                query.swing_speed = 'Fast'; 
            }
            console.log(`Filtering by swing speed: ${query.swing_speed}`);
        }

        
        if (answers[3]) {
            const launchPreference = answers[3];
            if (launchPreference === 'High') {
                query.launch = 'Low'; 
            } else if (launchPreference === 'Medium') {
                query.launch = 'Mid'; 
            } else if (launchPreference === 'Low') {
                query.launch = 'High'; 
            }
            console.log(`Filtering by launch preference: ${query.launch}`);
        }

        
        if (answers[4]) {
            const shotShape = answers[4];
            if (shotShape === 'Slice') {
                query.shot_shape_bias = 'Draw Bias'; 
            } else if (shotShape === 'Fade') {
                query.shot_shape_bias = { $in: ['Draw Bias', 'Neutral'] }; 
            } else if (shotShape === 'Straight') {
                query.shot_shape_bias = 'Neutral'; 
            } else if (shotShape === 'Draw') {
                query.shot_shape_bias = { $in: ['Fade Bias', 'Neutral'] }; 
            } else if (shotShape === 'Hook') {
                query.shot_shape_bias = 'Fade Bias'; 
            }
            console.log(`Filtering by shot shape: ${JSON.stringify(query.shot_shape_bias)}`);
        }

        
    if (answers[5]) {
        const struggle = answers[5];
    try {
        if (struggle === 'Distance') {
            query.launch = { $in: ['Low', 'Mid'] };
            query.adjustability = true; 
        } else if (struggle === 'Accuracy') {
            query.forgiveness = { $in: ['High', 'Very High'] };
            query.shot_shape_bias = { $in: ['Neutral', 'Draw Bias'] }; 
        } else if (struggle === 'Consistency') {
            query.forgiveness = { $in: ['High', 'Very High'] };
            query.adjustability = true; 
        } else if (struggle === 'Trajectory') {
            query.launch = { $in: ['Mid-High', 'High'] }; 
            
        } else if (struggle === 'Feel') {
            query.forgiveness = 'Moderate';
            query.adjustability = true; 
        }
        console.log(`Filtering by biggest struggle: ${struggle}`);
    } catch (error) {
        console.error('Error filtering by biggest struggle:', error);
        res.status(500).send('Internal Server Error');
    }
}




        
        // if (answers[6]) {
        //     const brand = answers[6];
        //     console.log(`Selected brand: ${brand}`); 
        //     if (brand.toLowerCase() === 'callaway') {
        //         query.brand = 'Callaway'; 
        //     } else if (brand.toLowerCase() === 'ping') {
        //         query.brand = 'Ping'; 
        //     } else if (brand.toLowerCase() === 'titleist') {
        //         query.brand = 'Titleist'; 
        //     } else if (brand.toLowerCase() === 'taylormade') {
        //         query.brand = 'TaylorMade'; 
        //     } else if (brand.toLowerCase() === 'cobra') {
        //         query.brand = 'Cobra'; 
        //     } else if (brand.toLowerCase() === 'pxg') {
        //         query.brand = 'PXG'; 
        //     } else {
                
        //         console.log('No specific brand preference. Including all brands.');
        //     }
        // }
        
        const allDrivers = await Driver.find();

        const criteriaKeys = Object.keys(query);
        const driversWithMatchPercentage = allDrivers.map(driver => {
            let matchCount = 0;
            const missingCriteria = [];

            
            criteriaKeys.forEach(key => {
                if (query[key]) {
                    if (typeof query[key] === 'object' && query[key].$lte !== undefined && query[key].$gte !== undefined) {
                        
                        if (driver[key] >= query[key].$gte && driver[key] <= query[key].$lte) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    } else if (typeof query[key] === 'object' && query[key].$in) {
                        
                        if (query[key].$in.includes(driver[key])) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    } else {
                        
                        if (driver[key] === query[key]) {
                            matchCount++;
                        } else {
                            missingCriteria.push(key);
                        }
                    }
                }
            });

            
            const matchPercentage = Math.round((matchCount / criteriaKeys.length) * 100);

            
            return { ...driver.toObject(), matchPercentage, missingCriteria };
        });

        
        driversWithMatchPercentage.sort((a, b) => b.matchPercentage - a.matchPercentage);

        
        questions.forEach((q, index) => {
            if (answers[index] && q.explanations) {
                
                q.explanation = q.explanations[answers[index]] || "";
            } else {
                
                q.explanation = "";
            }
        });

        
        const primaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage === 100);
        const secondaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage < 100 && driver.matchPercentage >= 75);
        const tertiaryRecommendations = driversWithMatchPercentage.filter(driver => driver.matchPercentage < 75 && driver.matchPercentage >= 50);

        console.log(`Primary recommendations count: ${primaryRecommendations.length}`);
        console.log(`Secondary recommendations count: ${secondaryRecommendations.length}`);
        
        req.session.query = query;
        req.session.shaftQuery = shaftQuery;
        
        res.render('results', { primaryRecommendations, secondaryRecommendations, tertiaryRecommendations, answers, questions});
        }   catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/selectShafts', async (req, res) => {
    try {
        
        // Extract driver details from the URL query parameters
        const { brand, model, price } = req.query;

        // Log the selected driver details
        console.log('Selected Driver:');
        console.log(`Brand: ${brand}`);
        console.log(`Model: ${model}`);
        console.log(`Price: ${price}`);

        const answers = Object.values(req.query);
        const shaftQuery = req.session.shaftQuery || {};
        console.log('Shaft Session query:', shaftQuery);

        const shafts = await Shaft.find({});
        console.log(`Number of shafts retrieved: ${shafts.length}`);
        res.render('selectShafts', { shafts });
    } catch (error) {
        console.error('Error fetching shafts:', error);
        res.status(500).send('Internal Server Error');
    }
}
);


// router.get('/selectShafts', async (req, res) => {
//     try {
//         const shafts = await Shaft.find({});
//         console.log(`Number of shafts retrieved: ${shafts.length}`); 
//         res.render('selectShafts', { shafts });
//     } catch (error) {
//         console.error('Error rendering selectShafts page:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });














        



module.exports = router;