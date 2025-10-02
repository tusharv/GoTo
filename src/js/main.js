/*global Typed axios secret*/

// Config data embedded for Manifest V3 compatibility
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

let dateContainnner, timeContainer;
let isVisible = true;
let typed;
const BGIMAGE_DELAY = 300; //60 * 5 secs = 5 Mins

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thuesday', 'Friday', 'Saturday'];

document.addEventListener('DOMContentLoaded', init);

function init() {
	timeContainer = document.getElementsByClassName('time')[0];
	dateContainnner = document.getElementsByClassName('date')[0];

	updateDate();
	window.requestAnimationFrame(updateTime);

	help();

	getBgImage();

	document.addEventListener('visibilitychange', onFocusUpdate);
	
	// Initialize footer menu toggle functionality
	initFooterMenu();
}

function help() {
	let options = [];

	for (var site in config) {
		options.push('goto ' + site + ' ' + config[site].param);
	}

	typed = new Typed('#message', {
		strings: options,
		shuffle: true,
		contentType: 'text',
		typeSpeed: 70,
		backDelay: 4000,
		startDelay: 4000,
		showCursor: false,
		loop: false
	});
}

function onFocusUpdate() {
	switch (document.visibilityState) {
	case 'visible':
		isVisible = true;
		updateTime();
		typed.start();
		break;
	case 'hidden':
		isVisible = false;
		if (!typed.isPaused) {
			typed.stop();
		}
		break;
	default:
		break;
	}
}

function updateTime() {
	var now = new Date();
	timeContainer.innerHTML = padNum(now.getHours()) + ':' + padNum(now.getMinutes()) + ':' + padNum(now.getSeconds());

	if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
		updateDate();
	}

	if (isVisible) {
		window.requestAnimationFrame(updateTime);
	}
}

function updateDate() {
	var now = new Date();
	var dayName = day[now.getDay()];
	var dayNumber = now.getDate();
	var monthName = month[now.getMonth()];
	var year = now.getFullYear();
	
	dateContainnner.innerHTML = dayName + ', ' + dayNumber + nth(dayNumber) + ' ' + monthName + ' ' + year;
}

function padNum(num) {
	return (num > 9) ? num : '0' + num;
}

function nth(d) {
	let result = '';
	if (d > 3 && d < 21) {
		result = 'th';
	} else {
		switch (d % 10) {
		case 1:
			result = 'st';
			break;
		case 2:
			result = 'nd';
			break;
		case 3:
			result = 'rd';
			break;
		default:
			result = 'th';
		}
	}
	return '<sup>' + result + '</sup>';
}

function getBgImage() {

	var then = localStorage.getItem('wallpaper');
	if(then){
		let now = new Date() / 1000;
		then = JSON.parse(then);
		if(now - Number(then.timestamp) < BGIMAGE_DELAY){
			updateWallpaper(then);
			return;
		}
	}
    
	axios.get('https://api.unsplash.com/photos/random?client_id=' + secret.unsplash.API_KEY + '&orientation=landscape&query=nature,landscape,minimalist,abstract,architecture&count=1&order_by=popular')
		.then(response => {
			if (response.data && response.data.length > 0) {
				let data = response.data[0]; // Get first photo from the array
				// Handle cases where description might be null or empty
				let description = data.description || data.alt_description || 'Beautiful landscape photo';
				let o = {
					image: data.urls.regular,
					color: data.color,
					description: description,
					name: data.user.name,
					link: data.user.links.html,
					timestamp: new Date()/1000
				};
				updateWallpaper(o);
				localStorage.setItem('wallpaper', JSON.stringify(o));
			}

		})
		// eslint-disable-next-line no-unused-vars
		.catch(error => {
			let o = {
				image: '../image/default.jpeg',
				color: '#000000',
				description: 'Default background image',
				name: 'Brandon Griggs',
				link: 'https://unsplash.com/@paralitik',
				timestamp: new Date()/1000
			};
			updateWallpaper(o);
		});
}

function updateWallpaper(wallpaper){
	document.body.style.backgroundImage = 'url(' + wallpaper.image + ')';
	document.body.style.backgroundColor = (wallpaper.color || '#000000');
	
	// Ensure description element exists and has content
	const descriptionElement = document.getElementById('description');
	if (descriptionElement) {
		descriptionElement.innerHTML = wallpaper.description || 'Beautiful photo';
	}
	
	document.getElementById('name').innerHTML = wallpaper.name;
	document.getElementById('link').href = wallpaper.link + '?utm_source=GoToExtension&utm_medium=referral';
}

// Footer menu functionality
function initFooterMenu() {
	// Check if user prefers popup menu (you can add localStorage logic here)
	const usePopupMenu = false; // Set to true to use popup menu by default
	
	if (usePopupMenu) {
		showPopupMenu();
	} else {
		showRegularFooter();
	}
}

function toggleFooterMenu() {
	const popup = document.getElementById('footer-menu-popup');
	if (popup.classList.contains('show')) {
		popup.classList.remove('show');
	} else {
		popup.classList.add('show');
	}
}

function showPopupMenu() {
	const footerLinks = document.getElementById('footer-links');
	const menuToggle = document.getElementById('menu-toggle');
	
	if (footerLinks && menuToggle) {
		footerLinks.style.display = 'none';
		menuToggle.style.display = 'block';
	}
}

function showRegularFooter() {
	const footerLinks = document.getElementById('footer-links');
	const menuToggle = document.getElementById('menu-toggle');
	
	if (footerLinks && menuToggle) {
		footerLinks.style.display = 'flex';
		menuToggle.style.display = 'none';
	}
}

function hidePopupMenu() {
	const popup = document.getElementById('footer-menu-popup');
	if (popup) {
		popup.classList.remove('show');
	}
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
	const menuToggle = document.getElementById('menu-toggle');
	const popup = document.getElementById('footer-menu-popup');
	
	if (menuToggle && popup && !menuToggle.contains(event.target)) {
		hidePopupMenu();
	}
});
