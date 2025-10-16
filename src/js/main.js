/*global Typed axios secret*/

// Config data loaded from centralized JSON file
let config = {};

// Load config from JSON file
(async () => {
	try {
		const response = await fetch(chrome.runtime.getURL('config.json'));
		config = await response.json();
		// Initialize typed examples after config is loaded
		if (typeof help === 'function') {
			help();
		}
	} catch (error) {
		console.error('Error loading config:', error);
		// Keep empty config as fallback
	}
})();

let dateContainnner, timeContainer;
let isVisible = true;
let typed;
const BGIMAGE_DELAY = 300; // 60 second * 5 mins = 300

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

document.addEventListener('DOMContentLoaded', init);

function init() {
	timeContainer = document.getElementsByClassName('time')[0];
	dateContainnner = document.getElementsByClassName('date')[0];

	updateDate();
	window.requestAnimationFrame(updateTime);

	// help() will be called after config is loaded
	getBgImage();
	
	// Initialize notes functionality
	initNotesWidget();

	document.addEventListener('visibilitychange', onFocusUpdate);
	
	// Listen for wallpaper reset events from options page
	window.addEventListener('wallpaperReset', (event) => {
		console.log('Wallpaper reset event received:', event.detail);
		// Only force new image if this is an explicit reset event
		if (event.detail && event.detail.forceReset) {
			forceNewBgImage();
		} else {
			getBgImage();
		}
	});
	
	// Add keyboard shortcut for manual refresh (Ctrl+R or Cmd+R)
	document.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
			e.preventDefault();
			// Clear cache and get new image
			localStorage.removeItem('wallpaper');
			forceNewBgImage();
		}
	});
	
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

function forceNewBgImage() {
	// Clear any existing wallpaper cache
	console.log('Force refreshing wallpaper - clearing cache');
	localStorage.removeItem('wallpaper');
	fetchNewWallpaper();
}

function getBgImage() {
	var then = localStorage.getItem('wallpaper');
	if(then){
		let now = new Date() / 1000;
		then = JSON.parse(then);
		let timeDiff = now - Number(then.timestamp);
		console.log('Cache check - Time diff:', timeDiff, 'BGIMAGE_DELAY:', BGIMAGE_DELAY);
		if(timeDiff < BGIMAGE_DELAY){
			console.log('Using cached wallpaper');
			updateWallpaper(then);
			return;
		}
		console.log('Cache expired, fetching new wallpaper');
	}
	console.log('No cache found, fetching new wallpaper');
	fetchNewWallpaper();
}

function fetchNewWallpaper() {
    
	// Load user-selected queries from localStorage (set by options page), fallback to default if not set
	let defaultQueries = ['nature', 'animals', 'landscape', 'minimalist', 'abstract', 'architecture'];
	let userQueries = [];
	try {
		const stored = localStorage.getItem('unsplashQueries');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) {
				userQueries = parsed;
			}
		}
	} catch (e) {
		// fallback to default
	}
	// Randomly select one query to increase variety
	const availableQueries = userQueries.length > 0 ? userQueries : defaultQueries;
	const randomQuery = availableQueries[Math.floor(Math.random() * availableQueries.length)];
	
	// Add cache busting parameter to ensure different images
	const cacheBuster = Date.now();
	axios.get('https://api.unsplash.com/photos/random?client_id=' + secret.unsplash.API_KEY + '&orientation=landscape&query=' + encodeURIComponent(randomQuery) + '&count=1&' + cacheBuster)
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
					photo_link: data.links.html,
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
	document.getElementById('photo_link').href = wallpaper.photo_link + '?utm_source=GoToExtension&utm_medium=referral';
}

// Notes Widget functionality
let notesData = [];
const MAX_NOTES = 50;
const MAX_NOTE_LENGTH = 150;

function initNotesWidget() {
	const addNoteBtn = document.getElementById('addNoteBtn');
	
	if (!addNoteBtn) {
		return; // Elements not found, skip initialization
	}
	
	// Load saved notes on initialization
	loadAllNotes();
	
	// Add event listeners
	addNoteBtn.addEventListener('click', addNewNote);
	
	// Initial render
	renderNotesList();
}



function addNewNote() {
	if (notesData.length >= MAX_NOTES) {
		alert(`Maximum ${MAX_NOTES} notes allowed.`);
		return;
	}
	
	const newNote = {
		id: generateNoteId(),
		content: '',
		timestamp: new Date().getTime(),
		isEditing: true
	};
	
	notesData.unshift(newNote); // Add to beginning
	renderNotesList();
	saveAllNotes();
	
	// Focus on the new note
	setTimeout(() => {
		const newNoteTextarea = document.querySelector(`[data-note-id="${newNote.id}"] textarea`);
		if (newNoteTextarea) {
			newNoteTextarea.focus();
		}
	}, 100);
}

function generateNoteId() {
	return 'note_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
}

function renderNotesList() {
	const notesList = document.getElementById('notesList');
	if (!notesList) return;
	
	if (notesData.length === 0) {
		notesList.innerHTML = '<div class="notes-empty">No notes yet. Click "Add Note" to get started!</div>';
		return;
	}
	
	notesList.innerHTML = notesData.map(note => `
		<div class="note-item" data-note-id="${note.id}">
			${note.isEditing ? `
				<textarea 
					class="note-textarea" 
					placeholder="What's on your mind?"
					maxlength="${MAX_NOTE_LENGTH}"
				>${note.content}</textarea>
				<div class="note-char-count">
					<span class="char-count">${note.content.length}/${MAX_NOTE_LENGTH}</span>
				</div>
			` : `
				<div class="note-content">${note.content || 'Empty note'}</div>
				<div class="note-timestamp">${formatNoteDate(note.timestamp)}</div>
			`}
			<button class="note-delete-btn" title="Delete note">×</button>
		</div>
	`).join('');
	
	// Add event listeners after rendering
	addNoteEventListeners();
	// Update character counts for editing notes
	updateCharCounts();
}

function addNoteEventListeners() {
	// Add event listeners for note content and delete buttons
	document.querySelectorAll('.note-content').forEach(contentDiv => {
		contentDiv.addEventListener('click', () => {
			const noteId = contentDiv.closest('.note-item').dataset.noteId;
			editNote(noteId);
		});
	});
	
	document.querySelectorAll('.note-delete-btn').forEach(deleteBtn => {
		deleteBtn.addEventListener('click', () => {
			const noteId = deleteBtn.closest('.note-item').dataset.noteId;
			deleteNote(noteId);
		});
	});
	
	document.querySelectorAll('.note-textarea').forEach(textarea => {
		const noteId = textarea.closest('.note-item').dataset.noteId;
		
		textarea.addEventListener('blur', () => {
			saveNote(noteId, textarea.value);
		});
		
		textarea.addEventListener('keydown', (event) => {
			handleNoteKeydown(event, noteId);
		});
	});
}

function handleNoteKeydown(event, noteId) {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		saveNote(noteId, event.target.value);
	}
	if (event.key === 'Escape') {
		cancelNoteEdit(noteId);
	}
	
	// Update character count in real-time
	setTimeout(() => updateCharCount(noteId, event.target.value.length), 0);
}

function updateCharCount(noteId, length) {
	const noteItem = document.querySelector(`[data-note-id="${noteId}"]`);
	const charCountSpan = noteItem?.querySelector('.char-count');
	if (charCountSpan) {
		charCountSpan.textContent = `${length}/${MAX_NOTE_LENGTH}`;
		charCountSpan.className = 'char-count';
		if (length >= MAX_NOTE_LENGTH * 0.9) charCountSpan.classList.add('char-count-warning');
		if (length >= MAX_NOTE_LENGTH) charCountSpan.classList.add('char-count-limit');
	}
}

function updateCharCounts() {
	document.querySelectorAll('.note-textarea').forEach(textarea => {
		const noteId = textarea.closest('.note-item').dataset.noteId;
		updateCharCount(noteId, textarea.value.length);
		
		textarea.addEventListener('input', () => {
			updateCharCount(noteId, textarea.value.length);
		});
	});
}

function editNote(noteId) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	note.isEditing = true;
	renderNotesList();
	
	setTimeout(() => {
		const textarea = document.querySelector(`[data-note-id="${noteId}"] textarea`);
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(textarea.value.length, textarea.value.length);
		}
	}, 50);
}

function saveNote(noteId, content) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	content = content.trim();
	
	if (content === '') {
		deleteNote(noteId);
		return;
	}
	
	note.content = content;
	note.isEditing = false;
	note.timestamp = new Date().getTime();
	
	renderNotesList();
	saveAllNotes();
}

function cancelNoteEdit(noteId) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	if (note.content === '') {
		deleteNote(noteId);
		return;
	}
	
	note.isEditing = false;
	renderNotesList();
}

function deleteNote(noteId) {
	const noteIndex = notesData.findIndex(n => n.id === noteId);
	if (noteIndex === -1) return;
	
	const note = notesData[noteIndex];
	if (note.content && !confirm('Are you sure you want to delete this note?')) {
		return;
	}
	
	notesData.splice(noteIndex, 1);
	renderNotesList();
	saveAllNotes();
}



function formatNoteDate(timestamp) {
	const now = new Date();
	const noteDate = new Date(timestamp);
	const diffTime = now - noteDate;
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays === 0) {
		return noteDate.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: false 
		});
	} else if (diffDays === 1) {
		return 'Yesterday';
	} else if (diffDays < 7) {
		return `${diffDays}d ago`;
	} else {
		return noteDate.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric' 
		});
	}
}

function saveAllNotes() {
	try {
		localStorage.setItem('goToNotesWidget', JSON.stringify(notesData));
		console.log('Notes saved successfully');
	} catch (error) {
		console.error('Error saving notes:', error);
	}
}

function loadAllNotes() {
	try {
		const savedNotes = localStorage.getItem('goToNotesWidget');
		if (savedNotes) {
			notesData = JSON.parse(savedNotes);
			// Ensure no notes are in editing mode after load
			notesData.forEach(note => note.isEditing = false);
			console.log('Notes loaded successfully');
		}
	} catch (error) {
		console.error('Error loading notes:', error);
		// Clear corrupted data
		localStorage.removeItem('goToNotesWidget');
		notesData = [];
	}
}