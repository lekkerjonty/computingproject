/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


// Toggle visibility for driver recommendations

document.addEventListener('DOMContentLoaded', () => {
    // Toggle visibility for primary recommendations
    const showAllPrimaryButton = document.getElementById('show-all-primary');
    if (showAllPrimaryButton) {
        console.log('Primary button found');
        showAllPrimaryButton.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.driver-card-primary.d-none');
            console.log('Primary hidden items:', hiddenItems.length);
            if (hiddenItems.length > 0) {
                // Show all hidden items
                hiddenItems.forEach(item => item.classList.remove('d-none'));
                showAllPrimaryButton.textContent = 'Show Less'; // Update button text
            } else {
                // Hide items beyond the first 4
                document.querySelectorAll('.driver-card-primary').forEach((item, index) => {
                    if (index >= 4) item.classList.add('d-none');
                });
                showAllPrimaryButton.textContent = 'Show All'; // Update button text
            }
        });
    } else {
        console.log('Primary button not found');
    }

    // Toggle visibility for secondary recommendations
    const showAllSecondaryButton = document.getElementById('show-all-secondary');
    if (showAllSecondaryButton) {
        console.log('Secondary button found');
        showAllSecondaryButton.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.driver-card-secondary.d-none');
            console.log('Secondary hidden items:', hiddenItems.length);
            if (hiddenItems.length > 0) {
                // Show all hidden items
                hiddenItems.forEach(item => item.classList.remove('d-none'));
                showAllSecondaryButton.textContent = 'Show Less'; // Update button text
            } else {
                // Hide items beyond the first 4
                document.querySelectorAll('.driver-card-secondary').forEach((item, index) => {
                    if (index >= 4) item.classList.add('d-none');
                });
                showAllSecondaryButton.textContent = 'Show All'; // Update button text
            }
        });
    } else {
        console.log('Secondary button not found');
    }

    // Toggle visibility for tertiary recommendations
    const showAllTertiaryButton = document.getElementById('show-all-tertiary');
    if (showAllTertiaryButton) {
        console.log('Tertiary button found');
        showAllTertiaryButton.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.driver-card-tertiary.d-none');
            console.log('Tertiary hidden items:', hiddenItems.length);
            if (hiddenItems.length > 0) {
                // Show all hidden items
                hiddenItems.forEach(item => item.classList.remove('d-none'));
                showAllTertiaryButton.textContent = 'Show Less'; // Update button text
            } else {
                // Hide items beyond the first 4
                document.querySelectorAll('.driver-card-tertiary').forEach((item, index) => {
                    if (index >= 4) item.classList.add('d-none');
                });
                showAllTertiaryButton.textContent = 'Show All'; // Update button text
            }
        });
    } else {
        console.log('Tertiary button not found');
    }
});

//End of script for Results page


//Start of script for Driver page


const questions = [
    {
        type: "radio",
        question: "What is your budget?",
        options: ["< £200", "£200 - £300", "£300 - £400", "£400+", "Don't Mind"]
    },
    {
        type: "radio",
        question: "What is your average driving carry distance?",
        options: ["< 200 yards", "200 - 225 yards", "225 - 250 yards", "250 - 275 yards", "> 275 yards"]
    },
    {
        type: "radio",
        question: "How would you describe your swing speed?",
        options: ["Slow", "Average", "Fast"]
    },
    {
        type: "radio",
        question: "Do you hit the ball low, medium or high?",
        options: ["Low", "Medium", "High"]
    },
    {
        type: "radio",
        question: "What is your most common shot shape?",
        options: ["Slice", "Fade", "Straight", "Draw", "Hook"]
    },
    {
        type: "radio",
        question: "What is your biggest struggle with your current driver?",
        options: ["Distance", "Accuracy", "Consistency", "Trajectory", "Feel"]
    },
    // {
    //     type: "radio",
    //     question: "Finally, Is there a specific brand you prefer?",
    //     options: ["Titleist", "Callaway", "TaylorMade", "Ping", "Cobra", "Mizuno", "Cleveland", "Srixon", "Wilson", "PXG", "Other/No Preference"]
    // }
];
const answers = [];
let currentQuestionIndex = 0;

function displayQuestion() {
    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question-custom').innerText = questionObj.question;
    const answerContainer = document.getElementById('answer-container');
    answerContainer.innerHTML = '';

    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group-custom';
    questionObj.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'form-check-custom';
        const input = document.createElement('input');
        input.type = 'radio';
        input.className = 'form-check-input-custom';
        input.name = 'radioOptions';
        input.value = option;
        const label = document.createElement('label');
        label.className = 'form-check-label-custom';
        label.innerText = option;
        div.appendChild(input);
        div.appendChild(label);
        radioGroup.appendChild(div);
    });
    answerContainer.appendChild(radioGroup);

    updateProgressBar();
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="radioOptions"]:checked');
    if (selectedOption) {
        answers.push(selectedOption.value);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            
            showLoadingScreen();

            
            setTimeout(() => {
                const queryString = answers
                    .map((ans, index) => `q${index}=${encodeURIComponent(ans)}`)
                    .join('&');
                window.location.href = `/results?${queryString}`;
            }, 2000);
        }
    } else {
        alert('Please provide an answer.');
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('show'); // Add the "show" class to make it visible
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar-custom');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
}



// Display the first question when the page loads
displayQuestion();