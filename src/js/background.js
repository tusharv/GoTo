// Config data loaded from centralized JSON file
let config = {};

// Load config from JSON file immediately when service worker starts
(async () => {
	try {
		const response = await fetch(chrome.runtime.getURL('config.json'));
		config = await response.json();
	} catch (error) {
		console.error('Error loading config:', error);
		// Keep empty config as fallback
	}
})();

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
