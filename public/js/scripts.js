/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


document.addEventListener('DOMContentLoaded', () => {
    // Show all primary recommendations
    const showAllPrimaryButton = document.getElementById('show-all-primary');
    if (showAllPrimaryButton) {
        showAllPrimaryButton.addEventListener('click', () => {
            document.querySelectorAll('.recommendation-item.d-none').forEach(item => {
                item.classList.remove('d-none');
            });
            showAllPrimaryButton.style.display = 'none'; // Hide the button after showing all
        });
    }

    // Show all secondary recommendations
    const showAllSecondaryButton = document.getElementById('show-all-secondary');
    if (showAllSecondaryButton) {
        showAllSecondaryButton.addEventListener('click', () => {
            document.querySelectorAll('.recommendation-item-secondary.d-none').forEach(item => {
                item.classList.remove('d-none');
            });
            showAllSecondaryButton.style.display = 'none'; // Hide the button after showing all
        });
    }
});