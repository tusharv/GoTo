// Config data loaded from centralized JSON file
let config = {};
let customKeywords = {};

// Load config from JSON file immediately when service worker starts
(async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const baseConfig = await response.json();
        
        // Load custom keywords
        const loadedCustomKeywords = await loadCustomKeywords();
        
        // Merge configs properly
        config = { ...baseConfig, ...loadedCustomKeywords };
        customKeywords = loadedCustomKeywords;
        
    } catch (error) {
        console.error('Error loading config:', error);
        // Try to load base config only as fallback
        try {
            const response = await fetch(chrome.runtime.getURL('config.json'));
            config = await response.json();
            customKeywords = {};
        } catch (fallbackError) {
            console.error('Critical error: Could not load any config', fallbackError);
            config = {};
            customKeywords = {};
        }
    }
})();

// Function to load custom keywords from localStorage
async function loadCustomKeywords() {
    try {
        // Check if Chrome storage API is available
        if (!chrome || !chrome.storage || !chrome.storage.local) {
            console.log('Chrome storage API not available, skipping custom keywords');
            return {};
        }
        
        // First try to get from Chrome storage
        const result = await chrome.storage.local.get(['customKeywords']);
        let storedKeywords = result.customKeywords || [];
        
        // If no Chrome storage data, try to sync from localStorage via content script
        if (storedKeywords.length === 0 && chrome.tabs) {
            // Try to get from any open tab that might have localStorage data
            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
                if (tab.url && tab.url.includes('options.html')) {
                    try {
                        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getCustomKeywords' });
                        if (response && response.customKeywords) {
                            storedKeywords = response.customKeywords;
                            // Sync to Chrome storage
                            await chrome.storage.local.set({ customKeywords: storedKeywords });
                            break;
                        }
                    } catch (e) {
                        // Tab might not have content script, continue
                    }
                }
            }
        }
        
        // Convert custom keywords to config format
        customKeywords = {};
        storedKeywords.forEach(keyword => {
            customKeywords[keyword.name] = {
                default: keyword.url,
                search: keyword.searchParam ? keyword.searchParam.replace('{0}', '{0}') : null,
                param: keyword.searchParam ? 'search term' : ''
            };
        });

        return customKeywords;
    } catch (error) {
        console.error('Error loading custom keywords:', error);
        return {};
    }
}

// Function to refresh config when custom keywords change
async function refreshConfig() {
    try {
        // Reload the base config
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const baseConfig = await response.json();
        
        // Load custom keywords again
        const loadedCustomKeywords = await loadCustomKeywords();
        
        // Re-merge with base config
        config = { ...baseConfig, ...loadedCustomKeywords };
        customKeywords = loadedCustomKeywords;
        
    } catch (error) {
        console.error('Error refreshing config:', error);
    }
}

let help = {
    content : 'help',
    description : 'Click here to see available options'
};

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function (text) {
        try {
            if (config) {
                let newURL = getService(text);
                chrome.tabs.create({
                    url: newURL
                });
            } else {
                // Fallback to Google search if config not loaded yet
                chrome.tabs.create({
                    url: 'https://www.google.com/search?q=' + encodeURIComponent(text)
                });
            }
        } catch (error) {
            console.error('Error in onInputEntered:', error);
            // Emergency fallback to Google search
            chrome.tabs.create({
                url: 'https://www.google.com/search?q=' + encodeURIComponent(text || '')
            });
        }
    });

chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        try {
            if(text && text.length > 1){
                if (config) {
                    suggest(updateList(text));
                } else {
                    // Fallback suggestions if config not loaded yet
                    suggest([{
                        content: text + ' ',
                        description: '"' + text + '" - Config loading, please wait...'
                    }]);
                }
            }
        } catch (error) {
            console.error('Error in onInputChanged:', error);
            // Emergency fallback suggestion
            suggest([{
                content: text + ' ',
                description: 'Error occurred - Config loading, please wait...'
            }, help]);
        }
    });

function getService(options){
    // Handle null, undefined, or empty options
    if (!options || typeof options !== 'string' || options.trim() === '') {
        // Return Google search for empty/invalid input
        return 'https://www.google.com/search?q=';
    }
    
    let params = options.toLowerCase().trim().split(' ');
    let keyAction = params[0];
    
    // Ensure config is loaded and keyAction exists
    if(!config || Object.keys(config).length === 0) {
        // Config not loaded yet, fallback to Google
        return 'https://www.google.com/search?q=' + encodeURIComponent(options);
    }
    
    if(params.length === 1 && config.hasOwnProperty(keyAction)){
        //Single Param 
        return config[keyAction].default;
    }else if(params.length === 2 && config.hasOwnProperty(keyAction) && config[keyAction].search){
        //Two Params
        return (config[keyAction].search).replace('{0}',params[1]);
    }else if(params.length >= 2 && config.hasOwnProperty(keyAction) && config[keyAction].search){
        //Multiple Params
        var query = params.slice(1).join(' ');
        return (config[keyAction].search).replace('{0}',encodeURIComponent(query));
    }

    //Fallback for Google
    return 'https://www.google.com/search?q=' + encodeURIComponent(options);
}

function updateList(text = ''){
    let list = [];
    
    // Handle null, undefined, or empty text
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return [help];
    }
    
    // Ensure config is loaded
    if(!config || Object.keys(config).length === 0) {
        // Config not loaded yet, return fallback suggestion
        return [{
            content: text + ' ',
            description: '"' + text + '" - Config loading, please wait...'
        }, help];
    }
    
    let params = text.toLowerCase().trim().split(' ');
    let keyAction = params[0];

    for(let site in config){
        if(site.indexOf(keyAction) > -1 || site == keyAction){
            let o = {};
            let desc = site + ' for ' + config[site].default;
            o.content = site;
            o.description = desc;
            list.push(o);
        }
    }

    if(list.length === 0){
        let o = {};
        o.content = text + ' ';
        o.description = '"' + text  + '" not found in GoTo, Press enter to search this in Google';
        list.push(o, help);
    }

    return list;
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
    } else if (request.action === 'testConfig') {
        sendResponse({ 
            success: true, 
            configKeys: Object.keys(config),
            customKeywords: Object.keys(customKeywords),
            hasPeer: config.hasOwnProperty('peer'),
            peerConfig: config.peer,
            totalConfigKeys: Object.keys(config).length
        });
        return true; // Keep the message channel open for async response
    }
    
    return false; // Close the message channel
});

// --- FINAL VERSION: Conditionally Open New Tab Page ---
const NEW_TAB_URL = 'chrome://newtab/';

chrome.tabs.onCreated.addListener(tab => {
  // A new tab's URL is often empty or "about:blank" initially, but the pendingUrl is set.
if (tab.pendingUrl === NEW_TAB_URL || tab.url === NEW_TAB_URL) {
    
    chrome.storage.sync.get(['newTabEnabled'], (result) => {
      // Redirect UNLESS the value is explicitly set to false.
      // This correctly handles 'true' and the initial 'undefined' state.
    if (result.newTabEnabled !== false) {
        
        chrome.tabs.update(tab.id, {
        url: chrome.runtime.getURL('page/new.html')
        });
    }
    });
}
});