// assets/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lookupForm');
    const resultDiv = document.getElementById('result');

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

        // 1. 构造原始的苹果 API URL
        let appleApiUrl = 'https://itunes.apple.com/lookup?';
        if (type === 'bundleId') {
            appleApiUrl += `bundleId=${encodeURIComponent(value)}`;
        } else {
            appleApiUrl += `id=${encodeURIComponent(value)}`;
        }

        // 2. 使用 allorigins.win 代理来请求这个 URL
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(appleApiUrl)}`;

        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error('Network response from proxy was not ok.');
            }

            const data = await response.json();
            
            // allorigins 返回的数据被包裹在 "contents" 字段中
            const appleResponse = JSON.parse(data.contents);

            if (appleResponse.resultCount === 0) {
                displayError("App not found. Please check the ID and try again.");
            } else {
                const appInfo = appleResponse.results[0];
                if (type === 'bundleId') {
                    displaySuccess(`<strong>Store ID:</strong> ${appInfo.trackId}`);
                } else {
                    displaySuccess(`<strong>Bundle ID:</strong> ${appInfo.bundleId}`);
                }
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            displayError("An error occurred. This could be a network issue or the proxy service is down.");
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
