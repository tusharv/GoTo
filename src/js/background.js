/*global config*/

let help = {
	content : 'help',
	description : 'Click here to see available options'
};

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
	function (text) {
		let newURL = getService(text);

		chrome.tabs.create({
			url: newURL
		});
	});

chrome.omnibox.onInputChanged.addListener(
	function(text, suggest) {
		if(text.length > 1){
			suggest(updateList(text));
		}
	});

function getService(options){
	let params = options.toLowerCase().split(' ');
	let keyAction = params[0];
    
	if(params.length === 1 && config.hasOwnProperty(keyAction)){
		//Single Param 
		return config[keyAction].default;
	}else if(params.length === 2 && config.hasOwnProperty(keyAction)){
		//Two Params
		return (config[keyAction].search).replace('{0}',params[1]);
	}else if(params.length >= 2 && config.hasOwnProperty(keyAction)){
		//Multiple Params
		var query = params.slice(1).join(' ');
		return (config[keyAction].search).replace('{0}',encodeURIComponent(query));
	}

	//Fallback for Google
	return 'https://www.google.com/search?q=' + encodeURIComponent(options);
}

function updateList(text = ''){
	let list = [];
	let params = text.toLowerCase().split(' ');
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