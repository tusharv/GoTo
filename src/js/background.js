// Config data embedded for Manifest V3 service worker
const config = {
	'git': {
		'default': 'https://github.com',
		'search': 'https://github.com/search?q={0}',
		'repositories': 'https://github.com/search?q={0}&type=Repositories',
		'repo': 'https://github.com/search?q={0}&type=Repositories',
		'code': 'https://github.com/search?q={0}&type=Code',
		'commits': 'https://github.com/search?q={0}&type=Commits',
		'issues': 'https://github.com/search?q={0}&type=Issues',
		'marketplace': 'https://github.com/search?q={0}&type=Marketplace',
		'market': 'https://github.com/search?q={0}&type=Marketplace',
		'topics': 'https://github.com/search?q={0}&type=Topics',
		'wikis': 'https://github.com/search?q={0}&type=Wikis',
		'users': 'https://github.com/search?q={0}&type=Users',
		'param': 'meshde'
	},
	'youtube': {
		'default': 'https://youtube.com',
		'search': 'https://www.youtube.com/results?search_query={0}',
		'param': 'origami'
	},
	'yt': {
		'default': 'https://youtube.com',
		'search': 'https://www.youtube.com/results?search_query={0}',
		'param': 'coding tech'
	},
	'bing': {
		'default': 'https://www.bing.com/',
		'search': 'https://www.bing.com/search?q={0}',
		'param': ''
	},
	'imdb': {
		'default': 'https://imdb.com',
		'search': 'https://www.imdb.com/find?q={0}&s=all',
		'param': 'despicable me'
	},
	'gmail': {
		'default': 'https://gmail.com',
		'search': 'https://mail.google.com/mail/u/0/#search/{0}',
		'from': 'https://mail.google.com/mail/u/0/#advanced-search/from={0}',
		'param': 'in:sent'
	},
	'mail': {
		'default': 'https://gmail.com',
		'search': 'https://mail.google.com/mail/u/0/#search/{0}',
		'param': 'varsha'
	},
	'drive': {
		'default': 'https://drive.google.com/',
		'search': 'https://drive.google.com/drive/search?q={0}',
		'param': 'salary slips'
	},
	'dri': {
		'default': 'https://drive.google.com/',
		'search': 'https://drive.google.com/drive/search?q={0}',
		'param': 'Report'
	},
	'map': {
		'default': 'https://www.google.com/maps/',
		'search': 'https://www.google.com/maps/search/{0}',
		'param': 'Goa'
	},
	'amazon': {
		'default': 'https://www.amazon.in/',
		'search': 'https://www.amazon.in/s?k={0}',
		'param': ''
	},
	'ama': {
		'default': 'https://www.amazon.in/',
		'search': 'https://www.amazon.in/s?k={0}',
		'param': 'OnePlus 7'
	},
	'flipkart': {
		'default': 'https://www.flipkart.com/',
		'search': 'https://www.flipkart.com/search?q={0}',
		'param': 'xbox one'
	},
	'flip': {
		'default': 'https://www.flipkart.com/',
		'search': 'https://www.flipkart.com/search?q={0}',
		'param': 'Mobile'
	},
	'fk': {
		'default': 'https://www.flipkart.com/',
		'search': 'https://www.flipkart.com/search?q={0}',
		'param': ''
	},
	'urbandictionary': {
		'default': 'https://www.urbandictionary.com/',
		'search' : 'https://www.urbandictionary.com/define.php?term={0}',
		'param': ''
	},
	'ud': {
		'default': 'https://www.urbandictionary.com/',
		'search' : 'https://www.urbandictionary.com/define.php?term={0}',
		'param': ''
	},
	'producthunt': {
		'default': 'https://www.producthunt.com/',
		'search': 'https://www.producthunt.com/search?q={0}',
		'param': ''
	},
	'ph': {
		'default': 'https://www.producthunt.com/',
		'search': 'https://www.producthunt.com/search?q={0}',
		'param': ''
	},
	'speed': {
		'default': 'https://www.speedtest.net/',
		'param': ''
	},
	'ip': {
		'default': 'https://ipinfo.io/',
		'param': ''
	},
	'weather': {
		'default': 'https://weather.com/en-IN/weather/today/',
		'param': ''
	},
	'weat': {
		'default': 'https://weather.com/en-IN/weather/today/',
		'param': ''
	},
	'gaana': {
		'default' : 'https://gaana.com/',
		'search': 'https://gaana.com/search/{0}',
		'param': 'Badshah'
	},
	'saavn': {
		'default' : 'https://www.jiosaavn.com/',
		'search': 'https://www.jiosaavn.com/search/{0}',
		'param': 'Emiway'
	},
	'spot': {
		'default' : 'https://open.spotify.com/browse/featured',
		'search': 'https://open.spotify.com/search/results/{0}',
		'param': 'Swades'
	},
	'spotify': {
		'default' : 'https://open.spotify.com/browse/featured',
		'search': 'https://open.spotify.com/search/results/{0}',
		'param': 'Gotye'
	},
	'twitter': {
		'default': 'https://twitter.com/',
		'search': 'https://twitter.com/search?q={0}',
		'param': ''
	},
	'twit': {
		'default': 'https://twitter.com/',
		'search': 'https://twitter.com/search?q={0}',
		'param': 'Grynn'
	},
	't': {
		'default': 'https://twitter.com/',
		'search': 'https://twitter.com/search?q={0}',
		'param': ''
	},
	'zomato': {
		'default': 'https://www.zomato.com/',
		'search': 'https://www.zomato.com/restaurants?q={0}',
		'param': ''
	},
	'zoma': {
		'default': 'https://www.zomato.com/',
		'search': 'https://www.zomato.com/restaurants?q={0}',
		'param': ''
	},
	'tax': {
		'default': 'https://www.incometaxindiaefiling.gov.in/',
		'param': ''
	},
	'linkedin': {
		'default': 'https://www.linkedin.com/',
		'search': 'https://www.linkedin.com/search/results/all/?keywords={0}',
		'param': 'arfat'
	},
	'link': {
		'default': 'https://www.linkedin.com/',
		'search': 'https://www.linkedin.com/search/results/all/?keywords={0}',
		'param': 'Bonzai'
	},
	'quora': {
		'default': 'https://www.quora.com/',
		'search': 'https://www.quora.com/search?q={0}',
		'param': ''
	},
	'q': {
		'default': 'https://www.quora.com/',
		'search': 'https://www.quora.com/search?q={0}',
		'param': ''
	},
	'reddit': {
		'default': 'https://www.reddit.com/',
		'search': 'https://www.reddit.com/search?q={0}',
		'param': ''
	},
	'r': {
		'default': 'https://www.reddit.com/',
		'search': 'https://www.reddit.com/search?q={0}',
		'param': ''
	},
	'medium': {
		'default': 'https://medium.com/',
		'search': 'https://medium.com/search?q={0}',
		'param': ''
	},
	'm': {
		'default': 'https://medium.com/',
		'search': 'https://medium.com/search?q={0}',
		'param': ''
	},
	'font': {
		'default': 'https://fonts.google.com/',
		'search': 'https://fonts.google.com/?query={0}',
		'param': 'Roboto'
	},
	'gfont': {
		'default': 'https://fonts.google.com/',
		'search': 'https://fonts.google.com/?query={0}',
		'param': ''
	},
	'trello': {
		'default': 'https://trello.com/',
		'search': 'https://trello.com/search?q={0}',
		'param': 'Anirudh'
	},
	'pinterest': {
		'default': 'https://www.pinterest.com/',
		'search': 'https://pinterest.com/search/pins/?q={0}',
		'param': 'doodle'
	},
	'pin': {
		'default': 'https://www.pinterest.com/',
		'search': 'https://pinterest.com/search/pins/?q={0}',
		'param': 'infographics'
	},
	'pint': {
		'default': 'https://www.pinterest.com/',
		'search': 'https://pinterest.com/search/pins/?q={0}',
		'param': 'DIY'
	},
	'wa': {
		'default': 'https://web.whatsapp.com/',
		'param': ''
	},
	'whatsapp': {
		'default': 'https://web.whatsapp.com/',
		'param': ''
	},
	'caniuse': {
		'default': 'https://caniuse.com/',
		'search': 'https://caniuse.com/#search={0}',
		'param': 'autoplay'
	},
	'cani': {
		'default': 'https://caniuse.com/',
		'search': 'https://caniuse.com/#search={0}',
		'param': 'grid'
	},
	'wiki': {
		'default': 'https://en.wikipedia.org/wiki/Main_Page',
		'search': 'https://en.wikipedia.org/wiki/{0}',
		'param': 'Jules Verne'
	},
	'wikipedia': {
		'default': 'https://en.wikipedia.org/wiki/Main_Page',
		'search': 'https://en.wikipedia.org/wiki/{0}',
		'param': 'Mumbai'
	},
	'codepen': {
		'default': 'https://codepen.io/',
		'search': 'https://codepen.io/search/pens?q={0}',
		'param': ''
	},
	'code': {
		'default': 'https://codepen.io/',
		'search': 'https://codepen.io/search/pens?q={0}',
		'param': ''
	},
	'so': {
		'default': 'https://stackoverflow.com/',
		'search': 'https://stackoverflow.com/search?q={0}',
		'param': 'moghya'
	},
	'stack': {
		'default': 'https://stackoverflow.com/',
		'search': 'https://stackoverflow.com/search?q={0}',
		'param': 'HTML5'
	},
	'stackoverflow': {
		'default': 'https://stackoverflow.com/',
		'search': 'https://stackoverflow.com/search?q={0}',
		'param': ''
	},
	'bitly': {
		'default': 'https://bitly.com/',
		'param': ''
	},
	'color': {
		'default': 'https://picular.co/',
		'search': 'https://picular.co/{0}',
		'param': 'gold'
	},
	'giphy': {
		'default': 'https://giphy.com/',
		'search': 'https://giphy.com/search/{0}',
		'param': 'lol'
	},
	'unsplash': {
		'default': 'https://unsplash.com/',
		'search': 'https://unsplash.com/search/photos/{0}',
		'param': 'nature'
	},
	'unsp': {
		'default': 'https://unsplash.com/',
		'search': 'https://unsplash.com/search/photos/{0}',
		'param': 'birds'
	},
	'us': {
		'default': 'https://unsplash.com/',
		'search': 'https://unsplash.com/search/photos/{0}',
		'param': ''
	},
	'fontawesome': {
		'default': 'https://fontawesome.com/',
		'search': 'https://fontawesome.com/icons?d=gallery&q={0}',
		'param': ''
	},
	'fa': {
		'default': 'https://fontawesome.com/',
		'search': 'https://fontawesome.com/icons?d=gallery&q={0}',
		'param': 'menu'
	},
	'webmakerapp': {
		'default': 'https://webmaker.app/app/',
		'param': ''
	},
	'wma': {
		'default': 'https://webmaker.app/app/',
		'param': ''
	},
	'wm': {
		'default': 'https://webmaker.app/app/',
		'param': ''
	},
	'geeksforgeeks': {
		'default': 'https://www.geeksforgeeks.org/',
		'param': ''
	},
	'g4g': {
		'default': 'https://www.geeksforgeeks.org/',
		'param': ''
	},
	'geek': {
		'default': 'https://www.geeksforgeeks.org/',
		'param': ''
	},
	'jsfiddle': {
		'default': 'https://jsfiddle.net/',
		'param': ''
	},
	'jf': {
		'default': 'https://jsfiddle.net/',
		'param': ''
	},
	'photopea': {
		'default': 'https://www.photopea.com/',
		'param': ''
	},
	'psd': {
		'default': 'https://www.photopea.com/',
		'param': ''
	},
	'hist': {
		'default': 'chrome://history/',
		'search': 'chrome://history/?q={0}',
		'param': ''
	},
	'history': {
		'default': 'chrome://history/',
		'search': 'chrome://history/?q={0}',
		'param': ''
	},
	'dino': {
		'default': 'chrome://dino/',
		'param': ''
	},
	'options': {
		'default': './page/options.html',
		'param': ''
	},
	'l': {
		'default': 'http://localhost/',
		'search': 'http://localhost:{0}',
		'param': '3000'
	},
	'localhost': {
		'default': 'http://localhost/',
		'search': 'http://localhost:{0}',
		'param': '8080'
	},
	'home': {
		'default': 'http://127.0.0.1',
		'search': 'http://127.0.0.1:{0}',
		'param': '8000'
	},
	'help': {
		'default': './page/options.html',
		'param': ''
	},
	'ext': {
		'default': 'chrome://extensions/',
		'param': ''
	},
	'papa': {
		'default': 'https://chrome.google.com/webstore/developer/dashboard',
		'param': ''
	},
	'me': {
		'default': 'http://tusharv.in/contact.html',
		'param': ''
	},
	'about': {
		'default': 'http://tusharv.in/contact.html',
		'param': ''
	},
};

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
