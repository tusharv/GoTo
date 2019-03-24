/*global config Typed axios secret*/

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
	dateContainnner.innerHTML = day[now.getDay()] + ' ' + padNum(now.getDate()) + nth(now.getDate()) + ' ' + month[now.getMonth()] + ', ' + now.getFullYear();
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
    
	axios.get('https://api.unsplash.com/photos/random?client_id=' + secret.unsplash.API_KEY + '&orientation=landscape')
		.then(response => {
			if (response.data) {
				let data = response.data;
				let o = {
					image: data.urls.regular,
					color: data.color,
					description: data.description,
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
				description: '',
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
	document.getElementById('description').innerHTML = wallpaper.description;
	document.getElementById('name').innerHTML = wallpaper.name;
	document.getElementById('link').href = wallpaper.link + '?utm_source=GoToExtension&utm_medium=referral';
}