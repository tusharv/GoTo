/* exported config */

// Config loaded from centralized JSON file
let config = {};

// Load config from JSON file
fetch(chrome.runtime.getURL('config.json'))
	.then(response => response.json())
	.then(data => {
		config = data;
	})
	.catch(error => {
		console.error('Error loading config:', error);
		// Keep empty config as fallback
	});
