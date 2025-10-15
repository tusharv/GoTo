// Config data loaded from centralized JSON file
let config = {};

// Load config from JSON file and initialize UI
(async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        config = await response.json();
        if (typeof init === 'function') {
            init();
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
})();

// This is the main function that runs when the page loads
function init() {
    // This function initializes the new tab toggle feature
    initNewTabToggle();
    
    // ... (Your other functions like populateKeywordsTable, initFAQ, etc., will be called here)
}

// --- NEW FEATURE: NEW TAB TOGGLE LOGIC ---
function initNewTabToggle() {
    const newTabToggle = document.getElementById('newTabToggle');
    const disabledBanner = document.getElementById('disabled-banner');

    if (!newTabToggle || !disabledBanner) return;

  // Function to show/hide banner based on toggle state
function updateBannerVisibility(isEnabled) {
    if (isEnabled) {
        disabledBanner.style.display = 'none';
    } else {
    disabledBanner.style.display = 'block';
    }
}

  // Load the saved setting from storage when the page opens
chrome.storage.sync.get(['newTabEnabled'], (result) => {
    const isEnabled = typeof result.newTabEnabled === 'undefined' ? true : result.newTabEnabled;
    newTabToggle.checked = isEnabled;
    updateBannerVisibility(isEnabled);
});

  // Add an event listener to save the setting and update the banner when the user clicks
newTabToggle.addEventListener('change', () => {
    const isEnabled = newTabToggle.checked;
    chrome.storage.sync.set({ newTabEnabled: isEnabled });
    updateBannerVisibility(isEnabled);
});
}