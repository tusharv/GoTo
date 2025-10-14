// Config data loaded from centralized JSON file
let config = {};
let customKeywords = {};

// Load config from JSON file immediately when service worker starts
(async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const baseConfig = await response.json();
        const loadedCustomKeywords = await loadCustomKeywords();
        config = { ...baseConfig, ...loadedCustomKeywords };
        customKeywords = loadedCustomKeywords;
    } catch (error) {
        console.error('Error loading config:', error);
    }
})();

// Function to load custom keywords
async function loadCustomKeywords() {
    try {
        if (!chrome || !chrome.storage || !chrome.storage.local) return {};
        const result = await chrome.storage.local.get(['customKeywords']);
        let storedKeywords = result.customKeywords || [];
        const customKeywordsConfig = {};
        storedKeywords.forEach(keyword => {
            customKeywordsConfig[keyword.name] = {
                default: keyword.url,
                search: keyword.searchParam ? keyword.searchParam.replace('{0}', '{0}') : null,
                param: keyword.searchParam ? 'search term' : ''
            };
        });
        return customKeywordsConfig;
    } catch (error) {
        console.error('Error loading custom keywords:', error);
        return {};
    }
}

// Function to refresh config when custom keywords change
async function refreshConfig() {
    try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const baseConfig = await response.json();
        const loadedCustomKeywords = await loadCustomKeywords();
        config = { ...baseConfig, ...loadedCustomKeywords };
        customKeywords = loadedCustomKeywords;
    } catch (error) {
        console.error('Error refreshing config:', error);
    }
}

let help = {
    content: 'help',
    description: 'Click here to see available options'
};

// Omnibox logic (unchanged)
chrome.omnibox.onInputEntered.addListener((text) => {
    try {
        if (config) {
            let newURL = getService(text);
            chrome.tabs.create({ url: newURL });
        } else {
            chrome.tabs.create({ url: 'https://www.google.com/search?q=' + encodeURIComponent(text) });
        }
    } catch (error) {
        console.error('Error in onInputEntered:', error);
    }
});
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    // ... (rest of omnibox logic is unchanged)
});
function getService(options) {
    // ... (rest of getService logic is unchanged)
}
function updateList(text = '') {
    // ... (rest of updateList logic is unchanged)
}

// Listen for storage changes to reload custom keywords
if (chrome && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.customKeywords) {
            refreshConfig();
        }
    });
}
// Listen for messages from options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'refreshConfig') {
        refreshConfig();
        sendResponse({ success: true });
    }
    return false;
});


// --- FINAL VERSION: New Tab Page Logic ---
chrome.tabs.onCreated.addListener(async (tab) => {
    // Check if the new tab is the default one
    if (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/') {
        
        // Get the user's setting
        const syncResult = await chrome.storage.sync.get(['newTabEnabled']);
        const isEnabled = syncResult.newTabEnabled !== false; // Default to true

        if (isEnabled) {
            // If enabled, redirect to the custom page
            chrome.tabs.update(tab.id, {
                url: chrome.runtime.getURL('page/new.html')
            });
        } else {
            // If DISABLED, check if we should show the options page reminder
            const localResult = await chrome.storage.local.get(['optionsPageNagLastShown']);
            const lastShown = localResult.optionsPageNagLastShown;
            const now = new Date().getTime();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (!lastShown || (now - lastShown > twentyFourHours)) {
                // If it was never shown, or shown more than 24 hours ago,
                // open the options page and update the timestamp.
                chrome.tabs.create({ url: 'page/options.html' });
                chrome.storage.local.set({ optionsPageNagLastShown: now });
            }
        }
    }
});