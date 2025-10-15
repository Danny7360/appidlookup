// assets/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lookupForm');
    const resultDiv = document.getElementById('result');

    // Check which input field exists on the current page to decide the lookup type
    const bundleIdInput = document.getElementById('bundleIdInput');
    const storeIdInput = document.getElementById('storeIdInput');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (bundleIdInput) {
                handleLookup('bundleId', bundleIdInput.value);
            } else if (storeIdInput) {
                handleLookup('storeId', storeIdInput.value);
            }
        });
    }

    async function handleLookup(type, value) {
        if (!value.trim()) {
            displayError("Input cannot be empty.");
            return;
        }

        displayLoading();

        let apiUrl = '';
            if (type === 'bundleId') {
                // Point to your new proxy function
                apiUrl = `/api/lookup?bundleId=${value}`;
            } else {
                // Point to your new proxy function
                apiUrl = `/api/lookup?id=${value}`;
        }
        
        try {
            // Using a proxy to avoid potential CORS issues if you deploy in certain environments.
            // For most static hosting, direct API call is fine. If it fails, use a CORS proxy.
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.resultCount === 0) {
                displayError("App not found. Please check the ID and try again.");
            } else {
                const appInfo = data.results[0];
                if (type === 'bundleId') {
                    displaySuccess(`<strong>Store ID:</strong> ${appInfo.trackId}`);
                } else {
                    displaySuccess(`<strong>Bundle ID:</strong> ${appInfo.bundleId}`);
                }
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            displayError("An error occurred. This could be a network issue or an invalid ID format.");
        }
    }

    function displayLoading() {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-container loading';
        resultDiv.innerHTML = 'Searching...';
    }

    function displayError(message) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-container error';
        resultDiv.innerHTML = message;
    }

    function displaySuccess(message) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-container';
        resultDiv.innerHTML = message;
    }
});